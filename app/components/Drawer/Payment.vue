<script setup lang="ts">
import { formatNumberPrice } from "~/lib/utils";

const props = defineProps<{
  onDone: () => void;
  onRetry?: () => void;
  isError?: boolean;
  amount: number;
}>();
</script>

<template>
  <div class="space-y-3" v-if="isError">
    <button
      @click="onRetry"
      class="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
    >
      <Icon name="lucide:refresh-ccw" class="size-4" />
      Coba Lagi
    </button>

    <button
      @click="onDone"
      class="w-full py-3 text-muted-foreground font-medium text-sm hover:text-foreground transition-all"
    >
      Batalkan
    </button>
  </div>
  <div v-else>
    <div class="flex flex-col items-center justify-center gap-12 w-full">
      <div class="text-center">
        <span
          class="text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >Saldo Masuk</span
        >
        <h1 class="text-6xl font-black text-foreground tracking-tighter">
          <span class="text-emerald-500 text-5xl">+</span
          >{{ formatNumberPrice(props.amount) }}
        </h1>
      </div>
      <button
        @click="onDone"
        class="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        Selesai
      </button>
    </div>
  </div>
</template>
