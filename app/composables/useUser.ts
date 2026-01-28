import type { UserRow } from "~/types/database";
import type { User } from "~/types/models";
import type { Database } from "~/types/database.types";

export const useUser = () => {
  const supabase = useSupabaseClient<Database>();

  const transformUser = (row: UserRow): User => ({
    id: row.id,
    username: row.username,
    fullName: row.fullname,
    phoneNumber: row.phone_number,
    address: row.address,
    role: row.role,
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

  const deleteUser = async (id: string) => {
    try {
      const response = await $fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
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

  return { fetchAllUsers, fetchProfile, createUser, deleteUser };
};
