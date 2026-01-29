<script setup lang="ts">
interface Props {
  checked: boolean;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:checked", "change"]);
const internalChecked = ref(props.checked);
watch(
  () => props.checked,
  (newVal) => {
    internalChecked.value = newVal;
  },
);

const toggle = () => {
  if (props.disabled) return;
  internalChecked.value = !internalChecked.value;
  emit("update:checked", internalChecked.value);
  emit("change", internalChecked.value);
};
</script>

<template>
  <button
    type="button"
    role="switch"
    @click="toggle"
    :disabled="disabled"
    class="peer inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
    :class="internalChecked ? 'bg-primary' : 'bg-input dark:bg-input/80'"
  >
    <span
      class="pointer-events-none block size-4 rounded-full ring-0 transition-transform"
      :class="
        internalChecked
          ? 'bg-background dark:bg-primary-foreground translate-x-[calc(100%-2px)]'
          : 'bg-foreground translate-x-0'
      "
    />
  </button>
</template>
