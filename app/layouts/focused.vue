<script setup lang="ts">
const route = useRoute();

const pageTitle = computed(() => {
  if (route.meta.title) {
    return route.meta.title as string;
  }

  return "Detail";
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <NavHeader>
      <div class="flex items-center flex-1 relative">
        <button
          @click="$router.back()"
          class="flex items-center justify-center -ml-1 active:scale-80 transition-transform duration-300 absolute top-0 bottom-0 left-0"
        >
          <Icon name="lucide:chevron-left" class="size-6" />
        </button>
        <div class="flex-1 flex items-center justify-center">
          <h1 class="font-semibold text-lg tracking-tight text-center">
            {{ pageTitle }}
          </h1>
        </div>
      </div>
    </NavHeader>

    <main class="p-5 pt-16">
      <slot />
    </main>
  </div>
</template>
