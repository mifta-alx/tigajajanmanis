<template>
  <div class="space-y-4 px-1">
    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <Skeleton class="h-[218px] bg-muted rounded-xl" />
      <Skeleton class="h-[218px] bg-muted rounded-xl" />
      <Skeleton class="h-[218px] bg-muted rounded-xl" />
      <Skeleton
        class="h-[218px] bg-muted rounded-xl sm:col-span-3 md:col-span-2"
      />
    </div>
    <Skeleton class="h-[416px] bg-muted rounded-xl" />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <Skeleton class="h-[412px] bg-muted rounded-xl" />
      </div>
      <Skeleton class="h-[412px] bg-muted rounded-xl" />
    </div>
  </div>
</template>
