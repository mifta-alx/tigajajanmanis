<script setup lang="ts">
const props = defineProps<{
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
  <div class="flex items-center justify-end h-10 w-28 shrink-0">
    <div
      class="flex flex-row-reverse items-center transition-all duration-300 ease-in-out rounded-full overflow-hidden"
      :class="
        currentVal > 0 ? 'bg-gray-100 p-1 shadow-inner' : 'bg-transparent'
      "
    >
      <button
        @click="increment"
        class="bg-sidebar-accent-foreground rounded-full size-8 flex items-center justify-center text-sidebar active:scale-90 transition-all duration-300 shadow-sm shrink-0 z-10"
      >
        <Icon name="lucide:plus" class="size-4" />
      </button>

      <div
        class="flex items-center transition-all duration-300 ease-in-out overflow-hidden"
        :class="currentVal > 0 ? 'w-auto opacity-100' : 'w-0 opacity-0'"
      >
        <button
          @click="decrement"
          class="bg-white rounded-full size-8 text-sidebar-accent-foreground flex items-center justify-center shadow-sm active:scale-75 shrink-0"
        >
          <Icon name="lucide:minus" class="size-4" />
        </button>

        <input
          :value="currentVal"
          type="number"
          readonly
          class="w-10 text-center bg-transparent font-semibold text-sm outline-none shrink-0"
        />
      </div>
    </div>
  </div>
</template>
