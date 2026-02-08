<template>
  <div class="space-y-4">
    <div
      v-for="i in 5"
      :key="i"
      class="flex gap-10 items-start justify-between border-b border-border last:border-0 pb-3"
    >
      <div class="space-y-2">
        <Skeleton class="h-4 w-40" />
        <Skeleton class="h-2 w-28" />
        <Skeleton class="h-4 w-32 mt-6" />
      </div>
      <Skeleton class="size-32 rounded-[1rem]" />
    </div>
  </div>
</template>
