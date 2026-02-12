<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  amount?: string;
  isPending?: boolean;
}>();
</script>

<template>
  <SkeletonHeader v-if="isPending" />
  <div v-else class="px-1 pt-2 flex items-end justify-between">
    <div class="space-y-0.5">
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {{ title }}
      </p>
      <h2 class="text-xl font-bold tracking-tight">{{ description }}</h2>
    </div>
    <div
      v-if="amount && amount !== ''"
      class="bg-secondary/50 px-3 py-1 rounded-full border border-border/50"
    >
      <p class="text-[10px] font-bold text-muted-foreground uppercase">
        {{ amount }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
