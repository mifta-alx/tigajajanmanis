<script setup lang="ts">
defineProps<{
  summary: any;
  pending: boolean;
}>();
import { formatNumberPrice } from "~/lib/utils";
</script>

<template>
  <Skeleton
    v-if="pending && !summary"
    class="w-full bg-muted h-32 rounded-[1.5rem]"
  />
  <div v-else class="bg-primary p-5 rounded-[1.5rem]">
    <div class="flex items-center gap-4">
      <div class="space-y-2.5">
        <p class="text-sm font-semibold text-primary-foreground tracking-tight">
          Pendapatan Hari Ini
        </p>
        <h3
          class="text-[40px] font-bold tracking-tighter text-primary-foreground leading-none"
        >
          {{ formatNumberPrice(summary.revenue ?? 0) }}
        </h3>
        <div
          v-if="summary.comparison.trend !== 'stagnant'"
          class="flex items-center gap-0.5 text-primary-foreground text-xs font-light -mt-2"
        >
          <Icon
            :name="
              summary.comparison.trend === 'up'
                ? 'lucide:arrow-up-right'
                : 'lucide:arrow-down-right'
            "
          />
          <span
            >{{ summary.comparison.percentage ?? 0 }}% dibandingkan
            kemarin</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
