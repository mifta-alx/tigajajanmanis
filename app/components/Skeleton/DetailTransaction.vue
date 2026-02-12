<script setup lang="ts">
import { formatNumberPrice, formatPrice } from "~/lib/utils";
</script>

<template>
  <div class="space-y-6 py-6 flex flex-col items-center justify-center w-full">
    <Skeleton class="size-24 rounded-full bg-muted" />
    <div class="space-y-4 flex flex-col items-center">
      <Skeleton class="h-8 w-60 bg-muted" />
      <Skeleton class="h-8 w-40 bg-muted" />
    </div>
    <div class="space-y-6 w-full">
      <div
        class="space-y-4 w-full bg-secondary/20 p-4 rounded-2xl border border-border/40"
      >
        <div
          class="flex items-center justify-between gap-2"
          v-for="i in 6"
          :key="i"
        >
          <Skeleton class="h-3 w-20 bg-muted" />
          <Skeleton class="h-3 w-28 bg-muted" />
        </div>
      </div>
    </div>
    <div class="space-y-8 w-full px-2">
      <div
        class="flex items-start justify-between gap-4"
        v-for="i in 6"
        :key="i"
      >
        <div class="flex flex-col gap-2">
          <Skeleton class="h-3 w-40 bg-muted" />
          <Skeleton class="h-3 w-20 bg-muted" />
        </div>
        <Skeleton class="h-3 w-20 bg-muted" />
      </div>
    </div>
  </div>
</template>
