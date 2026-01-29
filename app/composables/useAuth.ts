import type { AuthErrorResponse } from "~/types/models";

export const useAuth = () => {
  const client = useSupabaseClient();
  const loading = ref(false);

  const login = async (usernameInput: string, password: string) => {
    loading.value = true;

    try {
      const { exists } = await $fetch(`/api/auth/check-user`, {
        method: "POST",
        body: { username: usernameInput },
      });

      if (!exists) {
        throw {
          title: "Account Not Found",
          description:
            "The username you entered is not registered in our system.",
        };
      }

      const email = `${usernameInput.toLowerCase()}@tigajajanmanis.com`;
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

      const status = data.user?.app_metadata?.status;
      const role = data.user?.app_metadata?.role;

      if (status === 0 && role !== "admin") {
        await client.auth.signOut();
        throw {
          title: "Account Disabled",
          description:
            "Your account has been deactivated. Please contact the administrator.",
        };
      }

      await client.auth.getSession();
      return { data, error: null };
    } catch (err: any) {
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
    navigateTo("/login");
  };

  return { login, logout, loading };
};
