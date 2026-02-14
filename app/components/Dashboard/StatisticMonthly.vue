<script setup lang="ts">
import type { GeneralStatistics } from "~/types/dashboard";

defineProps<{
  data: GeneralStatistics;
}>();
</script>

<template>
  <Card class="px-6 h-full justify-between">
    <div class="flex flex-row justify-between items-center gap-2">
      <p class="text-base font-semibold text-foreground/90 tracking-tight">
        Statistics
      </p>
      <p class="text-xs text-muted-foreground/70">
        {{
          data.updatedAt !== "" ? `Updated ${data.updatedAt}` : "No activity"
        }}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-row gap-2 items-center">
        <div
          class="flex size-12 items-center justify-center rounded-lg bg-[#4cc9f0]/10 text-[#4cc9f0] shrink-0"
        >
          <Icon name="lucide:store" class="size-6" />
        </div>
        <div class="space-y-1">
          <p
            class="text-base font-semibold leading-none text-foreground/80 tracking-tight"
          >
            {{ data.totalOutlets }}
          </p>
          <p class="text-xs font-medium leading-none text-muted-foreground/70">
            Outlet
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div
          class="flex size-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0"
        >
          <Icon name="lucide:dollar-sign" class="size-6" />
        </div>
        <div class="space-y-1">
          <p
            class="text-base font-semibold leading-none text-foreground/80 tracking-tight"
          >
            {{ data.totalSales }}
          </p>
          <p class="text-xs font-medium leading-none text-muted-foreground/70">
            Sales
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div
          class="flex size-12 items-center justify-center rounded-lg bg-[#fb8500]/10 text-[#fb8500] shrink-0"
        >
          <Icon name="lucide:package-2" class="size-6" />
        </div>
        <div class="space-y-1">
          <p
            class="text-base font-semibold leading-none text-foreground/80 tracking-tight"
          >
            {{ data.totalMerchants }}
          </p>
          <p class="text-xs font-medium leading-none text-muted-foreground/70">
            Merchants
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div
          class="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0"
        >
          <Icon name="lucide:cake-slice" class="size-6" />
        </div>
        <div class="space-y-1">
          <p
            class="text-base font-semibold leading-none text-foreground/80 tracking-tight"
          >
            {{ data.totalProducts }}
          </p>
          <p class="text-xs font-medium leading-none text-muted-foreground/70">
            Products
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>
