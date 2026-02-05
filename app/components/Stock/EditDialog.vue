<script setup lang="ts">
import type { Stock } from "~/types/stock";
import { isInvalid } from "~/lib/utils";

const props = defineProps<{
  stock: Stock;
}>();

const emit = defineEmits(["success", "cancel"]);

const { form, loading } = useFormStockEdit({
  initialData: {
    id: props.stock.id,
    product_name: props.stock.product_name,
    quantity: props.stock.quantity,
  },
  onSuccess: () => emit("success"),
});

const getImage = (name: string, image: string) => {
  if (image && image.trim() !== "") return image;
  const firstLetter = name ? name.substring(0, 1).toUpperCase() : "P";
  return `https://placehold.co/100x100?text=${firstLetter}`;
};
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="gap-2">
      <form.Field name="quantity">
        <template #default="{ field: qtyField }">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <ImageWithFallback
                :src="
                  getImage(props.stock.product_name, props.stock?.image_url)
                "
                :alt="props.stock.product_name"
                class="size-12 rounded-md"
                imgClass="size-12 rounded-md"
                skeletonClass="size-12 rounded-md"
              />
              <div>
                <p class="text-sm font-semibold">
                  {{ props.stock.product_name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ props.stock.sku }}
                </p>
              </div>
            </div>

            <div class="w-32">
              <NumberField
                :model-value="qtyField.state.value"
                :min="0"
                @update:model-value="(val) => qtyField.handleChange(val)"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>
          </div>
          <FieldError
            v-if="isInvalid(qtyField)"
            :errors="[qtyField.state.meta.errors[0]]"
          />
        </template>
      </form.Field>
    </FieldGroup>
    <Field orientation="horizontal">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" :disabled="loading">
        <Spinner class="size-4" v-if="loading" />
        {{ loading ? "Saving..." : "Save" }}
      </Button>
    </Field>
  </form>
</template>
