<script setup lang="ts"></script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
    <header
      class="max-w-md mx-auto h-14 bg-background/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-between px-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="size-8 rounded-[1rem] bg-foreground flex items-center justify-center"
        >
          <Icon name="lucide:cookie" class="size-4 text-background" />
        </div>
        <span class="text-lg font-bold leading-none tracking-tighter"
          >TigaJajan.</span
        >
      </div>

      <div class="flex items-center gap-2">
        <button
          class="size-8 rounded-[0.8rem] hover:bg-secondary transition-colors flex items-center justify-center"
        >
          <Icon name="lucide:search" class="size-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  </div>
</template>
