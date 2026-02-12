<script setup lang="ts">
const props = defineProps<{
  label?: string;
  modelValue?: number;
}>();

const emit = defineEmits(["update:modelValue", "change"]);
const currentVal = computed(() => props.modelValue ?? 0);
const increment = () => {
  const newVal = currentVal.value + 1;
  emit("update:modelValue", newVal);
  emit("change", newVal);
};

const decrement = () => {
  if (currentVal.value > 0) {
    const newVal = currentVal.value - 1;
    emit("update:modelValue", newVal);
    emit("change", newVal);
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-9 w-fit shrink-0">
    <div
      class="relative flex items-center justify-center transition-all duration-300 ease-in-out rounded-full h-full w-full overflow-hidden bg-transparent"
    >
      <div
        class="flex flex-row-reverse items-center justify-between transition-all duration-300 ease-in-out rounded-full overflow-hidden w-full"
      >
        <button
          @click="increment"
          class="bg-primary text-primary-foreground rounded-full size-7 flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <Icon name="lucide:plus" class="size-4 stroke-[3px]" />
        </button>
        <input
          :value="currentVal"
          type="number"
          readonly
          class="w-12 text-center bg-transparent font-semibold text-sm outline-none shrink-0"
        />
        <button
          @click="decrement"
          class="bg-primary text-primary-foreground rounded-full size-7 flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <Icon name="lucide:minus" class="size-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  </div>
</template>
