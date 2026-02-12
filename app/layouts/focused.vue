<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
const route = useRoute();
const pageTitle = computed(() => route.meta.title || "Detail");

useHead({
  title: computed(() => `TigaJajan POS | ${pageTitle.value}`),
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <div
      class="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none bg-background"
    >
      <div
        class="max-w-md mx-auto flex items-center justify-start pointer-events-auto gap-2"
      >
        <button
          @click="$router.back()"
          class="flex items-center justify-center transition-all active:scale-90"
        >
          <ChevronLeft class="size-6 text-primary" />
        </button>
        <p
          class="text-foreground text-lg font-semibold tracking-tight line-clamp-1"
        >
          {{ pageTitle }}
        </p>
      </div>
    </div>

    <main class="px-6 pt-20">
      <slot />
    </main>
  </div>
</template>
