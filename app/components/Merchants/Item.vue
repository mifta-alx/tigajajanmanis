<script setup lang="ts">
import { getImage } from "~/lib/utils";

defineProps<{
  merchant: any;
}>();
</script>

<template>
  <NuxtLink
    :to="`/inventory/${merchant.id}`"
    class="group relative flex flex-col h-56 bg-card rounded-[1.5rem] border border-border overflow-hidden transition-all duration-300 active:scale-[0.98]"
  >
    <div class="relative h-3/5 w-full overflow-hidden bg-muted">
      <ImageWithFallback
        imgClass="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        skeletonClass="w-full h-full rounded-b-none"
        :src="getImage(merchant.name, merchant.image_url)"
        :alt="merchant.name"
        :animate="false"
      />
      <div
        class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20"
      >
        <p class="text-[9px] font-black text-white uppercase">
          {{ merchant.product_count }} SKU
        </p>
      </div>
    </div>
    <div class="flex-1 p-3.5 flex flex-col justify-between bg-card">
      <h3
        class="text-xs font-bold leading-tight uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2"
      >
        {{ merchant.name }}
      </h3>
      <div class="mt-2 flex items-center justify-between">
        <span
          class="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter"
          >Lihat Stok</span
        >
        <div
          class="size-6 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all"
        >
          <Icon name="lucide:chevron-right" class="size-3" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
