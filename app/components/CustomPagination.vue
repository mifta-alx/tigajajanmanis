<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
  perPage: number;
  paginationRange: (number | string)[];
  pending?: boolean;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
  "update:perPage": [size: number];
}>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row items-center justify-between px-2 w-full gap-4"
  >
    <div class="items-center gap-2 hidden md:flex">
      <p class="text-sm font-normal text-muted-foreground">Rows per page</p>
      <Select
        :model-value="`${perPage}`"
        @update:model-value="(v) => emit('update:perPage', Number(v))"
      >
        <SelectTrigger class="h-8 w-[70px]">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem
            v-for="size in [10, 20, 50, 100]"
            :key="size"
            :value="`${size}`"
          >
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="flex justify-between w-full md:w-fit items-center gap-4">
      <div class="text-sm font-normal text-muted-foreground">
        Page {{ currentPage }} of {{ totalPages }}
      </div>

      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="currentPage === 1 || pending"
          @click="emit('update:page', currentPage - 1)"
        >
          <Icon name="lucide:chevron-left" class="size-4" />
        </Button>

        <template v-for="(page, idx) in paginationRange" :key="idx">
          <Button
            v-if="typeof page === 'number'"
            :variant="page === currentPage ? 'outline' : 'ghost'"
            size="sm"
            class="size-8 hidden sm:flex"
            :disabled="pending"
            @click="emit('update:page', page)"
          >
            {{ page }}
          </Button>
          <span v-else class="px-2 text-muted-foreground font-bold">...</span>
        </template>

        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="currentPage === totalPages || pending"
          @click="emit('update:page', currentPage + 1)"
        >
          <Icon name="lucide:chevron-right" class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
