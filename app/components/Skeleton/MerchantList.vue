<template>
  <div class="grid grid-cols-2 gap-4">
    <Skeleton
      v-for="i in 10"
      :key="i"
      class="h-56 rounded-[1.5rem] border border-border/50 bg-muted"
    />
  </div>
</template>
<script setup lang="ts"></script>
