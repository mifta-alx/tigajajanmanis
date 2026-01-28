<script setup lang="ts">
const { toasts, remove } = useToast();
const icon = {
  success: "circle-check",
  warning: "triangle-alert",
  error: "octagon-x",
  info: "info",
};
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[356px]"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius)] border p-4 shadow-lg transition-all bg-popover text-popover-foreground border-border"
      >
        <template v-if="toast.type !== 'default'">
          <Icon :name="`lucide:${icon[toast.type]}`" class="size-4 -ms-1" />
        </template>

        <div class="grid gap-1">
          <div class="text-xs font-normal">{{ toast.title }}</div>
          <div v-if="toast.description" class="text-xs opacity-90">
            {{ toast.description }}
          </div>
        </div>

        <button
          @click="remove(toast.id)"
          class="absolute right-2 top-2 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-950"
          :class="{ 'text-white/50 hover:text-white': toast.type === 'error' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Animasi Slide-up ala Sonner */
.sonner-enter-active,
.sonner-leave-active {
  transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.sonner-enter-from {
  transform: translateY(100%) scale(0.9);
  opacity: 0;
}

.sonner-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

/* Membuat stack jika ada banyak (opsional, visual tipis) */
.sonner-move {
  transition: transform 0.35s ease;
}
</style>
