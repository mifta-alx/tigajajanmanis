import type { Role } from "~/types/role";
import type {
  CreateProfileDTO,
  UpdateProfileDTO,
  User,
} from "~/types/profiles";

interface ProfileResponse {
  id: string;
  username: string;
  fullname: string;
  phone_number: string;
  address: string | null;
  role: Role;
  is_active: boolean;
  outlet_id: string | null;
  outlets: { name: string } | null;
}
export const useUser = () => {
  const supabase = useSupabaseClient();

  const createUser = async (
    payload: CreateProfileDTO & {
      password: string;
    },
  ) => {
    return await $fetch("/api/users/create", {
      method: "POST",
      body: payload,
    });
  };

  const updateUser = async (id: string, payload: UpdateProfileDTO) => {
    const updateData: UpdateProfileDTO = {
      fullname: payload.fullname,
      phone_number: payload.phone_number,
      address: payload.address ?? null,
      role: payload.role as Role,
      outlet_id: payload.outlet_id,
    };
    const { error } = await (supabase.from("profiles") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  };

  const deleteUser = async (id: string) => {
    try {
      return await $fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const toggleStatus = async (userId: string, newStatus: boolean) => {
    try {
      await $fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: { is_active: newStatus },
      });
    } catch (err) {
      throw err;
    }
  };

  const fetchUsers = async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: User[];
    total: number;
  }> => {
    const { search, page = 1, limit = 1000 } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("profiles")
      .select(
        "id, username, fullname, phone_number, address, role, is_active, outlet_id, outlets:outlet_id (name)",
        {
          count: "exact",
        },
      );

    if (search) {
      query = query.or(`fullname.ilike.%${search}%,username.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: true })
      .range(from, to);

    const rawData = (data as unknown as ProfileResponse[]) || [];

    const transformed: User[] = rawData.map((m) => {
      const { outlets, ...profileData } = m;
      return {
        ...profileData,
        outlet_name: outlets?.name ?? "All Outlets",
      };
    });

    if (error) throw error;

    return {
      data: transformed,
      total: count || 0,
    };
  };

  return {
    fetchUsers,
    toggleStatus,
    createUser,
    updateUser,
    deleteUser,
  };
};
