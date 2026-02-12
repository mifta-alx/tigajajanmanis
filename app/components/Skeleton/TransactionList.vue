<template>
  <div class="space-y-4">
    <Skeleton
      class="h-[121px] w-full bg-muted rounded-[1.5rem]"
      v-for="i in 8"
      :key="i"
    />
  </div>
</template>
