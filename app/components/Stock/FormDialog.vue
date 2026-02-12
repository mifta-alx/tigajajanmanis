<script setup lang="ts">
import { isInvalid } from "~/lib/utils";
import { z } from "zod";
const props = defineProps<{
  initialDate?: string;
}>();

const { fetchSimpleMerchants } = useMerchant();
const { fetchProductByMerchant } = useProduct();
const emit = defineEmits(["success", "cancel"]);
const selectedMerchantId = ref<string>("");
const selectedOutletId = ref("");
const { data: merchants, pending } = useLazyAsyncData("simple-merchants", () =>
  fetchSimpleMerchants(),
);

const { form, loading, globalError } = useFormStock({
  initialDate: props.initialDate,
  onSuccess: () => emit("success"),
});

const availableOutlets = computed(() => {
  const merchant = merchants.value?.find(
    (m) => m.id === selectedMerchantId.value,
  );
  return (
    merchant?.outlets?.map((om) => ({
      id: om.id,
      name: om.name ?? "Unknown Outlet",
    })) || []
  );
});

watch(selectedMerchantId, (newId) => {
  form.setFieldValue("merchant_id", newId);

  const outlets = availableOutlets.value;
  if (outlets && outlets.length === 1) {
    const firstOutlet = outlets[0];
    if (firstOutlet) {
      selectedOutletId.value = firstOutlet.id;
      form.setFieldValue("outlet_id", firstOutlet.id);
    }
  } else {
    selectedOutletId.value = "";
    form.setFieldValue("outlet_id", "");
  }

  form.setFieldMeta("outlet_id", (prev) => ({
    ...prev,
    errors: [],
    errorMap: {},
    isTouched: false,
  }));
});

const { data: products, pending: productPending } = useLazyAsyncData(
  () => `products-${selectedMerchantId.value}-${selectedOutletId.value}`,
  async () => {
    if (!selectedMerchantId.value || !selectedOutletId.value) return [];
    const data = await fetchProductByMerchant(
      selectedOutletId.value,
      selectedMerchantId.value,
    );

    form.setFieldValue(
      "items",
      data.map((p) => ({
        product_id: p.id,
        quantity: 0,
      })),
    );

    return data;
  },
  {
    watch: [selectedMerchantId, selectedOutletId],
  },
);

const getImage = (name: string, image: string) => {
  if (image && image.trim() !== "") return image;
  const firstLetter = name ? name.substring(0, 1).toUpperCase() : "P";
  return `https://placehold.co/100x100?text=${firstLetter}`;
};
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="gap-4">
      <form.Field
        name="merchant_id"
        :validators="{
          onChange: z.string().min(1, 'Please select a merchant'),
        }"
      >
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name">
              Merchant
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              :name="field.name"
              :model-value="field.state.value"
              @update:model-value="
                (val) => {
                  field.handleChange(val as string);
                  selectedMerchantId = val as string;
                }
              "
            >
              <SelectTrigger :id="field.name" :aria-invalid="isInvalid(field)">
                <SelectValue placeholder="Select merchant" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <div
                  v-if="pending"
                  class="flex items-center justify-center py-2"
                >
                  <Spinner />
                </div>
                <SelectItem
                  v-else
                  v-for="(item, index) in merchants"
                  :key="index"
                  :value="item?.id"
                >
                  {{ item?.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError
              v-if="isInvalid(field)"
              :errors="[field.state.meta.errors[0]]"
            />
          </Field>
        </template>
      </form.Field>
      <form.Field
        v-if="availableOutlets.length > 1"
        name="outlet_id"
        :validators="{
          onChange: z.string().min(1, 'Please select a outlet'),
        }"
      >
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name">
              Outlet
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              :name="field.name"
              :model-value="field.state.value"
              :disabled="!selectedMerchantId"
              @update:model-value="
                (val) => {
                  field.handleChange(val as string);
                  selectedOutletId = val as string;
                }
              "
            >
              <SelectTrigger :id="field.name" :aria-invalid="isInvalid(field)">
                <SelectValue
                  :placeholder="
                    selectedMerchantId
                      ? 'Select outlet'
                      : 'Select merchant first'
                  "
                />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <div
                  v-if="pending"
                  class="flex items-center justify-center py-2"
                >
                  <Spinner />
                </div>
                <SelectItem
                  v-else
                  v-for="outlet in availableOutlets"
                  :key="outlet.id"
                  :value="outlet.id"
                >
                  {{ outlet?.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError
              v-if="isInvalid(field)"
              :errors="[field.state.meta.errors[0]]"
            />
          </Field>
        </template>
      </form.Field>
      <h3 class="text-sm font-medium">Product List</h3>
      <div
        v-if="!selectedMerchantId"
        class="flex justify-center items-center py-8 px-6 rounded-md border bg-transparent border-input dark:bg-input/30"
      >
        <p class="text-muted-foreground text-sm text-center">
          Please select a merchant to manage product stock
        </p>
      </div>
      <div class="flex flex-col gap-4" v-else-if="productPending">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center justify-between border-b last:border-0 last:pb-0 pb-4"
          role="status"
          aria-busy="true"
        >
          <div class="flex items-center gap-4">
            <Skeleton class="size-12 rounded-md bg-muted" />
            <div class="space-y-1.5">
              <Skeleton class="h-4 w-16 rounded-sm bg-muted" />
              <Skeleton class="h-2 w-28 rounded-sm bg-muted" />
            </div>
          </div>
          <Skeleton class="h-8 w-32 rounded-md bg-muted" />
        </div>
      </div>
      <div
        v-else-if="products && products.length > 0"
        v-for="(p, index) in products"
        :key="p.id"
        class="flex items-center justify-between border-b last:border-0 last:pb-0 pb-4"
      >
        <div class="flex items-center gap-4">
          <ImageWithFallback
            :src="getImage(p.name, p.image_url)"
            :alt="p.name"
            class="size-12 rounded-md"
            imgClass="size-12 rounded-md"
            skeletonClass="size-12 rounded-md"
          />
          <div>
            <p class="text-sm font-semibold">{{ p.name }}</p>
            <p class="text-xs text-muted-foreground">
              {{ p.sku }}
            </p>
            <p class="text-xs text-muted-foreground">
              Current Stock : {{ p.current_stock }}
            </p>
          </div>
        </div>

        <div class="w-32 shrink-0">
          <form.Field :name="`items[${index}].quantity`">
            <template #default="{ field: qtyField }">
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
            </template>
          </form.Field>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col gap-4 justify-center items-center py-8 px-6 rounded-md border bg-transparent border-input dark:bg-input/30"
      >
        <div class="text-center">
          <p class="text-sm font-medium">No products found for this merchant</p>
          <p class="text-xs text-muted-foreground">
            You need to add a product first before updating stock.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          @click="navigateTo('/admin/inventory/products')"
        >
          Create Product
        </Button>
      </div>
    </FieldGroup>

    <div v-if="globalError" class="text-sm font-medium text-destructive">
      {{ globalError }}
    </div>

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
