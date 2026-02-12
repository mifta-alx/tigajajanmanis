<script setup lang="ts">
import { formatNumberPrice } from "~/lib/utils";

defineProps<{
  show: boolean;
  totalItems: number;
  totalPrice: number;
}>();

const emit = defineEmits(["openReview"]);
</script>

<template>
  <div class="fixed bottom-9 left-0 right-0 p-6 z-40 pointer-events-none">
    <div
      class="max-w-md mx-auto pointer-events-auto flex flex-col items-center"
    >
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0 scale-95"
        enter-to-class="transform translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100 scale-100"
        leave-to-class="transform translate-y-2 opacity-0 scale-95"
      >
        <div v-if="show" class="w-full">
          <button
            @click="emit('openReview')"
            class="w-full active:scale-[0.98] duration-300 transition-all ease-in-out bg-primary backdrop-blur-md text-primary-foreground px-5 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center justify-between"
          >
            <div class="flex items-center justify-between gap-3 flex-1">
              <div class="flex flex-col items-start">
                <span
                  class="text-[12px] font-bold tracking-tight leading-none mb-1"
                >
                  {{ totalItems }}
                  item
                </span>
                <span
                  class="text-[10px] font-medium tracking-tight text-primary-foreground/80 leading-none"
                  >Total Produk</span
                >
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold tracking-tight leading-none">
                  {{ formatNumberPrice(totalPrice) }}
                </span>
                <Icon name="lucide:shopping-basket" class="size-6" />
              </div>
            </div>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
