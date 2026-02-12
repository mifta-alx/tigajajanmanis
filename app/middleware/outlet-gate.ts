export default defineNuxtRouteMiddleware(async (to) => {
  const { activeOutlet, fetchActiveOutlet } = useOutlet();
  const user = useSupabaseUser();

  const outletId = user.value?.user_metadata?.outlet_id;

  if (!activeOutlet.value && outletId) {
    await fetchActiveOutlet(outletId);
  }

  // if (!activeOutlet.value || !activeOutlet.value.is_open) {
  //   return navigateTo("/outlet");
  // }
});
