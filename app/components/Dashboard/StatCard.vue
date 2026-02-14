<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendUp: boolean;
}>();
</script>

<template>
  <Card class="px-6">
    <div class="flex flex-col items-start gap-3">
      <div
        class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
      >
        <Icon :name="icon" class="size-6" />
      </div>
      <div>
        <p class="text-base font-semibold text-foreground/90 tracking-tight">
          {{ title }}
        </p>
        <p
          class="text-base font-normal tracking-tight text-muted-foreground/60"
        >
          Last week
        </p>
        <h4 class="text-base font-semibold tracking-tight">{{ value }}</h4>
      </div>
      <div
        class="flex items-center w-fit px-2 py-1 rounded-xs"
        :class="trendUp ? 'bg-emerald-500/10' : 'bg-red-500/10'"
      >
        <span
          :class="trendUp ? 'text-emerald-600' : 'text-red-600'"
          class="text-xs font-medium"
        >
          {{ trend }}
        </span>
      </div>
    </div>
  </Card>
</template>
