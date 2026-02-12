<script setup lang="ts">
import { cn } from "~/lib/utils";

const { state, close } = useDrawer();

const onBackdropClick = () => {
  if (state.outsideClick) close();
};

const drawerTheme = computed(() => {
  const themes = {
    success: {
      bg: "bg-emerald-500",
      icon: "check",
      text: "text-emerald-500",
    },
    error: { bg: "bg-red-500", icon: "x", text: "text-red-500" },
    custom: {
      bg: "bg-primary",
      icon: state.value.icon || "shopping-bag",
      text: "text-primary",
    },
  };

  return themes[state.value.type as keyof typeof themes] || themes.custom;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="state.isOpen"
        @click="onBackdropClick"
        class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="state.isOpen"
        class="fixed inset-x-0 bottom-0 z-[101] mx-auto w-full max-w-lg bg-background shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-t-[4rem] border-t border-border/50 overflow-hidden"
      >
        <div class="px-8 pb-6 pt-10 space-y-10">
          <!--          <div-->
          <!--            :class="-->
          <!--              cn(-->
          <!--                'mx-auto flex size-24 items-center justify-center rounded-full',-->
          <!--                drawerTheme.bg,-->
          <!--              )-->
          <!--            "-->
          <!--          >-->
          <!--            <Icon-->
          <!--              :name="`lucide:${drawerTheme.icon}`"-->
          <!--              :class="-->
          <!--                cn(-->
          <!--                  'size-10 text-primary animate-in zoom-in duration-500',-->
          <!--                  drawerTheme.text,-->
          <!--                )-->
          <!--              "-->
          <!--            />-->
          <!--          </div>-->
          <div
            class="relative flex items-center justify-center size-24 mx-auto"
          >
            <div
              :class="
                cn(
                  'absolute inset-0 rounded-full animate-pulse',
                  `${drawerTheme.bg}/10`,
                )
              "
            ></div>
            <div
              :class="
                cn(
                  'relative size-14 rounded-full flex items-center justify-center',
                  drawerTheme.bg,
                )
              "
            >
              <Icon
                :name="`lucide:${drawerTheme.icon}`"
                class="size-8 text-white animate-in zoom-in duration-500 stroke-[4]"
              />
            </div>
          </div>
          <div class="text-center">
            <h2 class="text-2xl font-bold tracking-tight text-foreground">
              {{ state.title }}
            </h2>
            <p
              v-if="state.description"
              class="text-muted-foreground text-sm leading-relaxed"
            >
              {{ state.description }}
            </p>
          </div>

          <div
            v-if="state.component"
            class="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <component :is="state.component" v-bind="state.props" />
          </div>
          <button
            v-else
            @click="close()"
            class="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            Selesai
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Animasi Fade untuk Backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi Slide Up untuk Drawer */
.slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}

/* Mencegah Scroll pada Body saat drawer terbuka */
:global(body.drawer-open) {
  overflow: hidden;
}
</style>
