<script setup lang="ts">
const route = useRoute();

useSeoMeta({
  title: `TigaJajan POS | ${route.meta.title}`,
  ogTitle: `TigaJajan POS | ${route.meta.title}`,
  description: "",
  ogDescription: "",
});
</script>

<template>
  <div class="min-h-screen bg-background flex justify-center">
    <NavHeader v-if="!route.meta.hideHeader" />
    <main
      class="w-full lg:max-w-xl px-6 pb-24"
      :class="!route.meta.hideHeader ? 'pt-24' : 'pt-6'"
    >
      <slot />
    </main>
    <AppBottomNav />
  </div>
</template>
<script setup lang="ts"></script>
