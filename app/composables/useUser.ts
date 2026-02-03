import type { Profile } from "~/types/models";
import type { Role } from "~/types/role";
import type { CreateProfileDTO, UpdateProfileDTO } from "~/types/profiles";

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
    page: number;
    limit: number;
  }): Promise<{
    data: Omit<Profile, "created_at" | "updated_at">[];
    total: number;
  }> => {
    const { search, page, limit } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("profiles")
      .select(
        "id, username, fullname, phone_number, address, role, is_active",
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

    if (error) throw error;

    return {
      data,
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
