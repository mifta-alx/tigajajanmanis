<script setup lang="ts">
defineProps<{
  itemName: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-32 px-10 animate-in fade-in zoom-in-95 duration-500"
  >
    <div class="relative flex items-center justify-center mb-8">
      <div
        class="size-20 bg-muted-foreground/[0.03] border border-muted-foreground/5 rounded-[1.5rem] flex items-center justify-center"
      >
        <Icon name="lucide:search-x" class="size-10 text-muted-foreground/20" />
      </div>
    </div>
    <div class="text-center space-y-1">
      <h3 class="text-lg font-semibold text-foreground">
        <span class="capitalize">{{ itemName }}</span> tidak ditemukan
      </h3>
      <p class="text-sm text-slate-500 max-w-[280px] leading-relaxed">
        Maaf, kami tidak menemukan hasil untuk pencarianmu. Coba gunakan kata
        kunci lain.
      </p>
    </div>
  </div>
</template>
