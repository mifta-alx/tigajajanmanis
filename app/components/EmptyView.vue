<script setup lang="ts">
const props = defineProps<{
  icon: string | "store";
  name: string;
  onCreate: () => void;
}>();
</script>

<template>
  <Empty class="h-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Icon :name="`lucide:${props.icon}`" />
      </EmptyMedia>
      <EmptyTitle class="capitalize">No {{ props.name }}s Yet</EmptyTitle>
      <EmptyDescription>
        You haven't created any {{ props.name }}s yet. Get started by creating
        your first {{ props.name }}.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button @click="onCreate" class="capitalize"
        >Create {{ props.name }}</Button
      >
    </EmptyContent>
  </Empty>
</template>
