import type { Role } from "~/types/role";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const {
    data: { session },
  } = await client.auth.getSession();
  const currentUser = session?.user || user.value;

  const role = user.value?.app_metadata?.role as Role | undefined;
  const status = user.value?.app_metadata?.status;

  if (currentUser && status === 0 && role !== "admin") {
    await client.auth.signOut();
    return navigateTo("/login?error=account_disabled");
  }

  if (to.path === "/") {
    if (currentUser) return navigateTo("/admin/dashboard");
    return navigateTo("/login");
  }

  if (to.path.startsWith("/admin")) {
    if (!currentUser || role !== "admin") {
      return navigateTo("/login");
    }
  }

  if (to.path === "/login" && currentUser) {
    return navigateTo("/admin/dashboard");
  }
});
