import type { Role } from "~/types/role";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  const role = user.value?.app_metadata?.role as Role | undefined;

  if (!user.value && to.path.startsWith("/admin")) {
    return navigateTo("/login");
  }

  if (user.value) {
    if (to.path === "/login" || to.path === "/") {
      return navigateTo("/admin/dashboard");
    }

    if (to.path.startsWith("/admin") && role !== "admin") {
      return navigateTo("/login");
    }
  }
});
