import type { AuthErrorResponse } from "~/types/models";

export const useAuth = () => {
  const client = useSupabaseClient();
  const loading = ref(false);

  const login = async (usernameInput: string, password: string) => {
    loading.value = true;
    const email = `${usernameInput}@tigajajanmanis.com`;

    try {
      const { data: userExists } = await client
        .from("profiles")
        .select("id")
        .eq("username", usernameInput)
        .maybeSingle();

      if (!userExists) {
        throw {
          title: "Account Not Found",
          description:
            "The username you entered is not registered in our system.",
        };
      }

      const { data, error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw {
          title: "Authentication Failed",
          description:
            "The password you entered is incorrect. Please try again.",
        };
      }

      return { data, error: null };
    } catch (err: any) {
      console.log(err);
      const errorObj = err.title
        ? err
        : {
            title: "System Error",
            description: err.message || "An unexpected error occurred.",
          };

      return { data: null, error: errorObj as AuthErrorResponse };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await client.auth.signOut();
    userRole.value = null;
    username.value = null;
    navigateTo("/login");
  };

  return { login, logout, loading };
};
