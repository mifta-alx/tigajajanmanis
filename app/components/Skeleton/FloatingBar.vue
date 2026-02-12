<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
    <div
      class="relative z-10 w-full bg-background px-6 pb-6 pt-4 shadow-2xl border-t border-border/50"
    >
      <button
        :disabled="true"
        class="group relative w-full h-12 rounded-full bg-primary text-background transition-all active:scale-[0.97] disabled:grayscale disabled:opacity-50 overflow-hidden"
      >
        <div class="relative z-10 flex items-center justify-center gap-3">
          <Spinner />
        </div>
      </button>
    </div>
  </div>
</template>
