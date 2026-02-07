<script setup lang="ts">
const route = useRoute();

useSeoMeta({
  title: `TigaJajan POS | ${route.meta.title}`,
  ogTitle: `TigaJajan POS | ${route.meta.title}`,
  description: "",
  ogDescription: "",
});
</script>

<!--<template>-->
<!--  <div class="min-h-screen bg-background">-->
<!--    <div class="fixed top-0 left-0 right-0 z-50 px-6 pt-4">-->
<!--      <header class="max-w-md mx-auto h-14 flex items-center justify-between">-->
<!--        <button-->
<!--          @click="$router.back()"-->
<!--          class="size-10 rounded-xl bg-secondary flex items-center justify-center"-->
<!--        >-->
<!--          <Icon name="lucide:chevron-left" class="size-6 text-foreground" />-->
<!--        </button>-->
<!--      </header>-->
<!--    </div>-->
<!--    <main class="p-6 pt-24">-->
<!--      <slot />-->
<!--    </main>-->
<!--  </div>-->
<!--</template>-->
<template>
  <div class="min-h-screen bg-background">
    <div class="fixed top-0 left-0 right-0 z-50 px-6 pt-6 pointer-events-none">
      <div
        class="max-w-md mx-auto flex items-center justify-between pointer-events-auto"
      >
        <button
          @click="$router.back()"
          class="size-11 rounded-2xl bg-foreground/5 backdrop-blur-xl border border-foreground/5 flex items-center justify-center transition-all active:scale-90 shadow-sm"
        >
          <Icon name="lucide:chevron-left" class="size-6 text-foreground" />
        </button>

        <div
          class="size-11 rounded-2xl bg-foreground/5 backdrop-blur-xl border border-foreground/5 flex items-center justify-center"
        >
          <Icon name="lucide:cookie" class="size-6 text-foreground" />
        </div>
      </div>
    </div>

    <main class="px-6 pt-24">
      <slot />
    </main>
  </div>
</template>
