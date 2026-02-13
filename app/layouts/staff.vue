<script setup lang="ts">
const route = useRoute();
const { activeOutlet } = useOutlet();
const pageTitle = computed(() => route.meta.title || "");

const isLocked = computed(() => {
  return (
    activeOutlet.value &&
    !activeOutlet.value.is_open &&
    route.path !== "/outlets"
  );
});

useHead({
  title: computed(() => `TigaJajan POS | ${pageTitle.value}`),
  bodyAttrs: {
    class: computed(() => (isLocked.value ? "overflow-hidden" : "")),
  },
});
</script>

<template>
  <div class="min-h-screen bg-background flex justify-center">
    <NavHeader v-if="!route.meta.hideHeader" />
    <main class="w-full lg:max-w-xl px-6 pb-16 transition-all duration-300">
      <slot />
      <div
        v-if="isLocked"
        class="fixed inset-0 z-30 bg-background flex flex-col items-center justify-center animate-in fade-in duration-300"
      >
        <StaffClosedState />
      </div>
    </main>
    <AppBottomNav />
  </div>
</template>
