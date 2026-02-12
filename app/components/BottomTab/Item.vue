<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: "#",
    required: true,
  },
  icon: {
    type: String,
    default: "home",
  },
});
const route = useRoute();
const isActive = computed(() => {
  return route.path.startsWith(props.href);
});
</script>

<template>
  <NuxtLink
    :to="href"
    :class="{
      'text-primary!': isActive,
    }"
    class="flex flex-col items-center justify-center w-full h-full text-foreground/80 dark:text-muted-foreground/60 gap-1.5"
  >
    <Icon :name="`lucide:${icon}`" class="size-6" />
    <span class="text-xs">
      <slot />
    </span>
  </NuxtLink>
</template>
