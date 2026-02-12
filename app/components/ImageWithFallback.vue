<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  src: string;
  alt: string;
  imgClass: string;
  skeletonClass: string;
  animate?: boolean;
}>();
const animateClass = props.animate !== false ? "animate-pulse" : "";
</script>

<template>
  <NuxtImg :src="props.src" :custom="true" v-slot="{ src, isLoaded, imgAttrs }">
    <div :class="cn('relative w-full h-full shrink-0', props.class)">
      <div
        v-if="!isLoaded"
        :class="
          cn(
            props.skeletonClass,
            'bg-muted absolute inset-0 z-10 shrink-0',
            animateClass,
          )
        "
      />

      <img
        v-bind="imgAttrs"
        :src="src"
        :alt="props.alt"
        :class="
          cn(
            props.imgClass,
            'transition-opacity duration-300 shrink-0 object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )
        "
      />
    </div>
  </NuxtImg>
</template>
