<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-1 pt-4">
      <div class="space-y-1.5">
        <Skeleton class="h-2 w-16 bg-muted" />
        <Skeleton class="h-7 w-36 bg-muted" />
        <Skeleton class="h-2 w-24 bg-muted" />
      </div>
      <Skeleton class="size-12 rounded-2xl bg-muted" />
    </div>
    <Skeleton
      class="h-[74px] w-full rounded-[1.5rem] border border-border/50 bg-muted"
    />
    <div class="space-y-2">
      <Skeleton class="h-2 w-24 bg-muted" />
      <Skeleton
        class="h-[131px] w-full rounded-[1.5rem] border border-border/50 bg-muted"
      />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
