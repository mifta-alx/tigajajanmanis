import type { Role } from "~/types/role";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const currentUser = user.value;
  const guestRoutes = ["/", "/login"];

  const role = currentUser?.app_metadata?.role as Role | undefined;
  const status = currentUser?.app_metadata?.status;

  if (currentUser && status === 0 && role !== "admin") {
    const client = useSupabaseClient();
    await client.auth.signOut();
    return navigateTo("/login?error=account_disabled");
  }

  if (guestRoutes.includes(to.path)) {
    if (currentUser) {
      return role === "admin"
        ? navigateTo("/admin/dashboard")
        : navigateTo("/products");
    }
    if (to.path === "/") return navigateTo("/login");
  }

  if (
    to.path === "/admin" ||
    to.path === "/admin/" ||
    to.path.startsWith("/admin/")
  ) {
    if (!currentUser || role !== "admin") {
      return navigateTo("/login");
    }

    if (to.path === "/admin" || to.path === "/admin/") {
      return navigateTo("/admin/dashboard");
    }
  }
});
