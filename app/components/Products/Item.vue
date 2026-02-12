<script setup lang="ts">
import { formatPrice, getImage } from "~/lib/utils";

const props = defineProps<{
  product: any;
  modelValue?: number;
  isLast: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const quantity = computed({
  get: () => props.modelValue ?? 0,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="group relative flex items-start gap-10 pb-8 pt-4 first:pt-0">
    <div
      class="absolute -left-6 top-0 bottom-0 bg-primary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      :class="[quantity > 0 ? 'w-[5px]' : 'w-0']"
    />
    <div
      v-if="!isLast"
      class="absolute bottom-0 right-0 h-px last:h-0 border-b border-border transition-all duration-300"
      :class="[quantity > 0 ? 'left-[-18px]' : 'left-0']"
    />
    <div class="flex-1 min-w-0 flex flex-col justify-start h-full py-1 gap-2">
      <h3
        class="text-base font-semibold leading-tight tracking-tight text-foreground line-clamp-2"
      >
        {{ product.name }}
      </h3>

      <p class="text-sm text-foreground/60 tracking-tight font-normal">
        {{ product.merchant_name }}
      </p>
      <div class="mt-3 gap-2 flex flex-row items-center">
        <p class="text-base font-semibold text-foreground tracking-tight">
          {{ formatPrice(product.selling_price) }}
        </p>
        <Badge variant="secondary"> {{ product.current_stock }} Tersisa </Badge>
      </div>
    </div>

    <div class="relative">
      <div class="size-32 rounded-[1rem] overflow-hidden shrink-0 bg-muted">
        <ImageWithFallback
          :src="getImage(product.name, product.image_url)"
          :alt="product.name"
          imgClass="size-full object-cover group-hover:scale-110 transition-transform duration-500"
          skeletonClass="size-full"
        />
      </div>
      <div
        class="absolute -bottom-4 right-0 left-0 flex justify-center items-center z-20"
      >
        <ProductsNumberInput v-model="quantity" :max="product.current_stock" />
      </div>
    </div>
  </div>
</template>
