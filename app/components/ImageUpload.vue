<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | null; // url preview image
  label?: string;
  error?: string;
}>();

const emit = defineEmits(["change"]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const isHovered = ref(false);
const localPreview = ref("");
const isRemoved = ref(false);

const displayImage = computed(() => {
  if (isRemoved.value) return "";
  return localPreview.value || props.modelValue;
});

const handleFilePickerClick = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    localPreview.value = URL.createObjectURL(file);
    isRemoved.value = false;
    emit("change", file);
  }
};

const handleRemove = () => {
  if (localPreview.value) {
    URL.revokeObjectURL(localPreview.value);
  }
  localPreview.value = "";
  isRemoved.value = true;
  if (fileInputRef.value) fileInputRef.value.value = "";
  emit("change", null);
};

watch(
  () => props.modelValue,
  () => {
    isRemoved.value = false;
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-4 w-full">
    <Label v-if="label">{{ label }}</Label>

    <div class="relative group w-full">
      <div
        v-if="displayImage"
        class="relative h-[120px] w-full overflow-hidden rounded-md border border-input"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <img
          :src="displayImage"
          class="h-full w-full object-cover"
          alt="Preview"
        />

        <div
          v-if="isHovered"
          class="absolute inset-0 flex items-center justify-center bg-background/50 transition-all duration-300"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            @click.stop="handleRemove"
          >
            <Icon name="lucide:trash" class="size-6" />
          </Button>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center h-[120px] w-full border rounded-md transition-all duration-300 bg-input/30 hover:bg-input/60"
        :class="[error ? 'border-destructive' : 'border-input']"
        @click="handleFilePickerClick"
      >
        <div
          class="flex flex-col items-center justify-center space-y-3 text-muted-foreground"
        >
          <Icon name="lucide:image" class="size-6" />
          <div class="text-center">
            <p class="text-[10px]">Choose image</p>
          </div>
        </div>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        accept="image/*"
        @change="handleFileChange"
      />
    </div>

    <p v-if="error" class="text-xs font-medium text-destructive mt-1">
      {{ error }}
    </p>
  </div>
</template>
