<script setup lang="ts"></script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 px-2"
    >
      <div class="gap-2 flex flex-col items-center md:items-start">
        <Skeleton class="bg-muted w-64 h-12 rounded-xl" />
        <Skeleton class="bg-muted w-40 h-4 rounded-xl" />
      </div>
      <Skeleton class="bg-muted w-full md:w-40 h-10 rounded-xl" />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Skeleton class="bg-muted rounded-[1.5rem] h-[82px]" />
      <Skeleton class="bg-muted rounded-[1.5rem] h-[82px]" />
      <Skeleton class="bg-muted rounded-[1.5rem] h-[82px]" />
    </div>
    <Skeleton class="bg-muted rounded-[1.5rem] h-[486px]" />
  </div>
</template>
