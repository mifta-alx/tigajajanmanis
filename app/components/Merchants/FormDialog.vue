<script setup lang="ts">
import type { Merchant } from "~/types/merchant";
import { isInvalid } from "~/lib/utils";

const props = defineProps<{
  merchant?: Merchant | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { form, loading, imageFile } = useFormMerchant({
  merchant: props.merchant,
  onSuccess: () => emit("success"),
});

const { fetchOutlets } = useOutlet();
const { data: outletsResponse, pending: outletPending } = useAsyncData(
  "outlets-list",
  () => fetchOutlets(),
);

const outlets = computed(() => outletsResponse.value?.data || []);
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="grid sm:grid-cols-4 gap-4">
      <form.Field name="image_file">
        <template #default="{ field }">
          <ImageUpload
            label="Logo"
            :model-value="props.merchant?.image_url"
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
        <form.Field name="name">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Merchant name
                <span className="text-destructive">*</span></FieldLabel
              >
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder="Enter a merchant name"
                autocomplete=""
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

        <form.Field name="phone_number">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name"> Phone number </FieldLabel>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder="08123456789"
                autocomplete=""
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
      <div class="space-y-4 sm:col-span-4">
        <form.Field name="outlet_ids">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name"> Outlet </FieldLabel>
              <Select
                multiple
                :name="field.name"
                :model-value="field.state.value || []"
                @update:model-value="
                  (val: any) => {
                    field.handleChange(val);
                  }
                "
              >
                <SelectTrigger
                  :id="field.name"
                  :aria-invalid="isInvalid(field)"
                >
                  <SelectValue placeholder="Select outlet" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    <div
                      v-if="outletPending"
                      class="flex items-center justify-center py-2"
                    >
                      <Spinner />
                    </div>
                    <SelectItem
                      v-for="outlet in outlets"
                      :key="outlet.id"
                      :value="outlet.id"
                    >
                      {{ outlet.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError
                v-if="isInvalid(field)"
                :errors="[field.state.meta.errors[0]]"
              />
            </Field>
          </template>
        </form.Field>
        <form.Field name="address">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name"> Address </FieldLabel>
              <Textarea
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder="Baker Street 16 th"
                class="min-h-[120px]"
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
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
