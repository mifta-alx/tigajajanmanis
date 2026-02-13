<template>
  <div
    class="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in-95 duration-500"
  >
    <div class="relative flex items-center justify-center mb-8">
      <div
        class="size-24 bg-muted-foreground/[0.03] border border-muted-foreground/5 rounded-[1.5rem] flex items-center justify-center"
      >
        <Icon
          name="lucide:door-closed-locked"
          class="size-12 text-muted-foreground/20"
        />
      </div>
    </div>

    <div class="text-center px-8">
      <span
        class="px-3 py-1 bg-muted-foreground/10 text-muted-foreground/80 text-[10px] font-bold uppercase tracking-widest rounded-full"
      >
        Outlet Belum Buka
      </span>
      <h2
        class="text-2xl font-bold text-foreground mt-4 leading-none tracking-tight"
      >
        Siap untuk berjualan?
      </h2>
      <p class="text-sm font-medium text-muted-foreground/60 mt-3">
        Halaman hanya bisa diakses saat status outlet aktif. Silakan buka outlet
        terlebih dahulu
      </p>
    </div>

    <NuxtLink
      to="/outlets"
      class="mt-8 flex items-center gap-2 pl-6 pr-4 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-xm tracking-tight active:scale-[0.98] transition-all"
    >
      Buka Outlet

      <Icon name="lucide:chevron-right" class="size-4" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts"></script>
