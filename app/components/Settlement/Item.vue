<script setup lang="ts">
import { formatPrice, getImage } from "~/lib/utils";

defineProps<{
  stock: any;
  isSelected: boolean;
}>();

const emit = defineEmits(["toggle"]);
</script>

<template>
  <div
    class="group relative flex items-start gap-10 pb-8 pt-4 first:pt-0 border-b border-border last:border-0"
  >
    <div class="flex-1 min-w-0 flex flex-col justify-start h-full py-1 gap-3">
      <h3
        class="text-base font-semibold leading-tight tracking-tight text-foreground line-clamp-2"
      >
        {{ stock.product_name }}
      </h3>

      <div class="gap-2 flex flex-row items-center">
        <Badge> {{ stock.total_sold ?? 0 }} Terjual </Badge>
        <Badge variant="secondary">
          {{ stock.current_stock ?? 0 }} Tersisa
        </Badge>
      </div>
      <p class="text-base font-semibold text-foreground tracking-tight">
        {{ formatPrice(stock.selling_price) }}
      </p>
    </div>

    <div class="relative">
      <div class="size-32 rounded-[1rem] overflow-hidden shrink-0 bg-muted">
        <ImageWithFallback
          :src="getImage(stock.product_name, stock.image_url)"
          :alt="stock.product_name"
          imgClass="size-full object-cover group-hover:scale-110 transition-transform duration-500"
          skeletonClass="size-full"
        />
      </div>
      <div
        class="absolute -bottom-4 right-0 left-0 flex justify-center items-center z-20"
      >
        <button
          @click="emit('toggle', stock.product_id)"
          :class="[
            'flex items-center justify-center transition-all duration-300 ease-in-out rounded-full h-9 w-28 border',
            isSelected
              ? 'bg-primary-foreground text-primary border-primary'
              : 'bg-primary text-primary-foreground border-primary-foreground',
          ]"
        >
          <span class="text-xs font-bold tracking-tight">{{
            isSelected ? "Batal" : "Pilih"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
