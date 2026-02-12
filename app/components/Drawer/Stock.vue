<script setup lang="ts">
defineProps<{
  onDone: () => void;
  onRetry?: () => void;
  isError?: boolean;
}>();
</script>

<template>
  <div class="space-y-3">
    <template v-if="isError">
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
    </template>

    <template v-else>
      <NuxtLink
        to="/products"
        @click="onDone"
        class="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        Lihat produk
      </NuxtLink>

      <button
        @click="onDone"
        class="w-full py-2 text-muted-foreground font-medium text-sm hover:bg-secondary rounded-xl transition-all"
      >
        Selesai
      </button>
    </template>
  </div>
</template>
