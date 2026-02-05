<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  src: String;
  alt: String;
  imgClass: String;
  skeletonClass: String;
}>();
</script>

<template>
  <NuxtImg :src="props.src" :custom="true" v-slot="{ src, isLoaded, imgAttrs }">
    <div :class="cn('relative w-full h-full shrink-0', props.class)">
      <Skeleton
        v-if="!isLoaded"
        :class="[props.skeletonClass, 'absolute inset-0 z-10 shrink-0']"
      />

      <img
        v-bind="imgAttrs"
        :src="src"
        :alt="props.alt"
        :class="[
          props.imgClass,
          'transition-opacity duration-300 shrink-0 object-cover',
          isLoaded ? 'opacity-100' : 'opacity-0',
        ]"
      />
    </div>
  </NuxtImg>
</template>
