import type { UserRow } from "~/types/database";
import type { UpdateProfilePayload, User } from "~/types/models";
import type { Database } from "~/types/database.types";
import type { Role } from "~/types/role";

export const useUser = () => {
  const supabase = useSupabaseClient<Database>();

  const transformUser = (row: UserRow): User => ({
    id: row.id,
    username: row.username,
    fullName: row.fullname,
    phoneNumber: row.phone_number,
    address: row.address,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

  const createUser = async (
    payload: Omit<User, "id" | "createdAt" | "updatedAt"> & {
      password: string;
    },
  ) => {
    return await $fetch("/api/users/create", {
      method: "POST",
      body: payload,
    });
  };

  const updateUser = async (id: string, payload: Partial<User>) => {
    const dbPayload: UpdateProfilePayload = {
      fullname: payload.fullName,
      phone_number: payload.phoneNumber,
      address: payload.address ?? null,
      role: payload.role as Role,
    };
    const { error } = await (supabase.from("profiles") as any)
      .update(dbPayload)
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

  const toggleStatus = async (user: any) => {
    const newStatus = user.status === 1 ? 0 : 1;

    try {
      await $fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: { status: newStatus },
      });

      user.status = newStatus;
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ? data.map(transformUser) : [];
  };

  const fetchProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data ? transformUser(data) : null;
  };

  return { fetchAllUsers, fetchProfile, createUser, updateUser, deleteUser };
};
