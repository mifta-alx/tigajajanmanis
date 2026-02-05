<script setup lang="ts">
import type { Product } from "~/types/product";
import { isInvalid } from "~/lib/utils";

const props = defineProps<{
  product?: Product | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { fetchSimpleMerchants } = useMerchant();

const { data: merchants, pending } = useLazyAsyncData("simple-merchants", () =>
  fetchSimpleMerchants(),
);

const { form, loading, imageFile } = useFormProduct({
  product: props.product,
  onSuccess: () => emit("success"),
});

const formatDisplay = (val: number) => {
  if (!val) return "";
  return new Intl.NumberFormat("id-ID").format(val);
};

const unformatPriceBase = (val: string) => {
  if (!val) return 0;
  const numeric = val.replace(/\D/g, "");
  return parseInt(numeric, 10) || 0;
};
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="grid sm:grid-cols-4 gap-4">
      <form.Field name="image_file">
        <template #default="{ field }">
          <ImageUpload
            label="Image"
            :model-value="props.product?.image_url"
            @change="
              (file) => {
                imageFile = file;
                field.handleChange(file);
              }
            "
          />
        </template>
      </form.Field>
      <div class="space-y-4 sm:col-span-3">
        <form.Field name="merchant_id">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Merchant
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(val) => field.handleChange(val as string)"
              >
                <SelectTrigger
                  :id="field.name"
                  :aria-invalid="isInvalid(field)"
                >
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

        <form.Field name="name">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Product name
                <span className="text-destructive">*</span></FieldLabel
              >
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder="Enter a product name"
                autocomplete="off"
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
              <FieldError
                v-if="isInvalid(field)"
                :errors="[field.state.meta.errors[0]]"
              />
            </Field>
          </template>
        </form.Field>
      </div>
      <div class="sm:col-span-2">
        <form.Field name="cost_price">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Cost price <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>Rp.</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  :id="field.name"
                  :name="field.name"
                  :model-value="formatDisplay(field.state.value)"
                  :aria-invalid="isInvalid(field)"
                  placeholder="0.00"
                  autocomplete="off"
                  @blur="field.handleBlur"
                  @input="
                    (e) => field.handleChange(unformatPriceBase(e.target.value))
                  "
                />
              </InputGroup>
              <FieldError
                v-if="isInvalid(field)"
                :errors="[field.state.meta.errors[0]]"
              />
            </Field>
          </template>
        </form.Field>
      </div>
      <div class="sm:col-span-2">
        <form.Field name="selling_price">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Selling price <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>Rp.</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  :id="field.name"
                  :name="field.name"
                  :model-value="formatDisplay(field.state.value)"
                  :aria-invalid="isInvalid(field)"
                  placeholder="0.00"
                  autocomplete="off"
                  @blur="field.handleBlur"
                  @input="
                    (e) => field.handleChange(unformatPriceBase(e.target.value))
                  "
                />
              </InputGroup>
              <FieldError
                v-if="isInvalid(field)"
                :errors="[field.state.meta.errors[0]]"
              />
            </Field>
          </template>
        </form.Field>
      </div>
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
