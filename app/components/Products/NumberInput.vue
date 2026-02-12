<script setup lang="ts">
const props = defineProps<{
  label?: string;
  modelValue?: number;
  max?: number;
}>();

const emit = defineEmits(["update:modelValue", "change"]);
const currentVal = computed(() => props.modelValue ?? 0);
const increment = () => {
  if (props.max !== undefined && currentVal.value >= props.max) {
    return;
  }
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
  <div class="flex items-center justify-center w-28 shrink-0">
    <div
      class="relative flex items-center justify-center transition-all duration-300 ease-in-out rounded-full h-full w-full overflow-hidden bg-primary p-0.5 border border-primary-foreground"
    >
      <button
        @click="increment"
        :disabled="max !== undefined && currentVal >= max"
        class="absolute inset-0 bg-primary text-primary-foreground w-full h-full flex items-center justify-center transition-opacity duration-300 ease-in-out z-20"
        :class="
          currentVal > 0
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 pointer-events-auto'
        "
      >
        <span class="text-xs font-bold tracking-tight">{{
          label ?? "Tambah"
        }}</span>
      </button>
      <div
        class="flex flex-row-reverse items-center justify-between transition-all duration-300 ease-in-out rounded-full overflow-hidden w-full bg-primary"
        :class="
          currentVal > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        "
      >
        <button
          @click="increment"
          class="bg-primary-foreground text-primary border border-primary rounded-full size-7 flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <Icon name="lucide:plus" class="size-4 stroke-[3px]" />
        </button>
        <input
          :value="currentVal"
          type="number"
          readonly
          class="w-10 text-primary-foreground text-center bg-transparent font-semibold text-sm outline-none shrink-0"
        />
        <button
          @click="decrement"
          class="bg-primary-foreground text-primary border border-primary rounded-full size-7 flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <Icon name="lucide:minus" class="size-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  </div>
</template>
