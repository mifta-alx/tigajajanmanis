<script setup lang="ts">
import { getImage } from "~/lib/utils";

defineProps<{
  data: any;
}>();
</script>
<template>
  <Card class="px-6 gap-4 h-full">
    <div>
      <p class="text-base font-semibold text-foreground/90 tracking-tight">
        Top Products
      </p>
      <p class="text-xs text-muted-foreground">Most ordered items this week</p>
    </div>
    <div class="space-y-4">
      <div
        v-for="(product, i) in data"
        :key="product.name"
        class="flex items-center justify-between transition-colors gap-4"
      >
        <div class="flex items-center gap-2">
          <div class="relative">
            <ImageWithFallback
              :src="getImage(product.name, product.image_url)"
              :alt="product.name"
              class="size-12 rounded-md"
              imgClass="size-12 rounded-md"
              skeletonClass="size-12 rounded-md"
            />
            <span
              class="absolute -top-1 -left-1 z-20 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold"
            >
              {{ i + 1 }}
            </span>
          </div>
          <div>
            <p class="text-sm font-semibold line-clamp-1">{{ product.name }}</p>
            <p class="text-xs text-muted-foreground tracking-tight">
              {{ product.merchant_name }}
            </p>
          </div>
        </div>
        <p class="text-base font-semibold text-right shrink-0">
          {{ product.total_qty }} <span class="text-sm font-medium">sold</span>
        </p>
      </div>
    </div>
  </Card>
</template>
