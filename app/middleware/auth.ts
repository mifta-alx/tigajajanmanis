import type { Role } from "~/types/role";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const role = user.value?.app_metadata?.role as Role | undefined;

  if (to.path === "/") {
    if (user.value) return navigateTo("/admin/dashboard");
    return navigateTo("/login");
  }

  if (to.path.startsWith("/admin")) {
    if (!user.value || role !== "admin") {
      return navigateTo("/login");
    }
  }

  if (to.path === "/login" && user.value) {
    return navigateTo("/admin/dashboard");
  }
});
