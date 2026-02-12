<template>
  <div
    class="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-2"
  >
    <div
      class="size-10 shrink-0 rounded-xl bg-amber-500 dark:bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"
    >
      <Icon name="lucide:lock-keyhole" class="size-5 text-white" />
    </div>
    <div class="space-y-1">
      <p
        class="text-[11px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider"
      >
        Akses Terbatas
      </p>
      <p
        class="text-[13px] font-medium leading-snug text-amber-900/80 dark:text-amber-600/80"
      >
        Anda belum bisa menambah stok baru karena terdapat sesi stok sebelumnya
        yang belum dikembalikan (retur).
      </p>
    </div>
  </div>
</template>
