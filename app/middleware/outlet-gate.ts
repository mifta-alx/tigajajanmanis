export default defineNuxtRouteMiddleware(async (to) => {
  const { activeOutlet, fetchActiveOutlet } = useOutlet();
  const user = useSupabaseUser();

  if (user.value && to.path !== "/outlets") {
    const outletId = user.value.user_metadata?.outlet_id;

    if (outletId && !activeOutlet.value) {
      await fetchActiveOutlet(outletId);
    }
  }
});
