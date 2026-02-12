<script setup lang="ts">
const route = useRoute();
const { activeOutlet } = useOutlet();
const pageTitle = computed(() => route.meta.title || "");

useHead({
  title: computed(() => `TigaJajan POS | ${pageTitle.value}`),
});
</script>

<template>
  <div class="min-h-screen bg-background flex justify-center">
    <NavHeader v-if="!route.meta.hideHeader" />
    <main class="w-full lg:max-w-xl px-6 transition-all duration-300">
      <slot />
      <ClientOnly>
        <div
          v-if="!activeOutlet?.is_open && route.path !== '/outlets'"
          class="absolute inset-0 z-30 bg-background pt-20 px-6"
        >
          <StaffClosedState />
        </div>
      </ClientOnly>
    </main>
    <AppBottomNav />
  </div>
</template>
