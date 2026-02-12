<script setup lang="ts">
defineProps<{
  show: boolean;
  totalSelected: number;
  totalQuantity: number;
  isSubmitting?: boolean;
  isPending?: boolean;
}>();

const emit = defineEmits(["submit"]);
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
    <div class="max-w-md mx-auto pointer-events-auto relative">
      <div class="absolute bottom-full left-0 right-0 overflow-hidden -mt-10">
        <Transition
          enter-active-class="transition duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          enter-from-class="transform translate-y-full"
          enter-to-class="transform translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0"
          leave-to-class="transform translate-y-full"
        >
          <div v-if="show" class="w-full">
            <div
              class="bg-primary backdrop-blur-md text-primary-foreground px-5 py-2.5 shadow-2xl border border-background/10 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <span
                    class="text-[8px] font-medium uppercase tracking-widest leading-none mb-1"
                    >Total Produk</span
                  >
                  <span
                    class="text-[11px] font-bold uppercase tracking-tight leading-none"
                    >{{ totalSelected }} item</span
                  >
                </div>
                <div class="h-6 w-px bg-primary-foreground/50"></div>
                <div class="flex flex-col">
                  <span
                    class="text-[8px] font-medium uppercase tracking-widest leading-none mb-1"
                    >Total Stok</span
                  >
                  <span
                    class="text-[11px] font-bold uppercase tracking-tight leading-none"
                    >{{ totalQuantity }} Pcs</span
                  >
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <SkeletonFloatingBar v-if="isPending" />
      <div
        v-else
        class="relative z-10 w-full bg-background px-6 pb-6 pt-4 shadow-2xl border-t border-border/50"
      >
        <button
          @click="emit('submit')"
          :disabled="isSubmitting || !show"
          class="group relative w-full h-12 rounded-full bg-primary text-primary-foreground transition-all active:scale-[0.97] disabled:grayscale disabled:opacity-50 overflow-hidden"
        >
          <div class="relative z-10 flex items-center justify-center gap-3">
            <Spinner v-if="isSubmitting" class="size-4" />
            <span v-else class="text-sm font-semibold">Simpan stok </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
