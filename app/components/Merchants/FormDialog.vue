<script setup lang="ts">
import type { MerchantWithProfile } from "~/types/merchant";
import { isInvalid } from "~/lib/utils";

const props = defineProps<{
  merchant?: MerchantWithProfile | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { form, loading, logoFile } = useFormMerchant({
  merchant: props.merchant,
  onSuccess: () => emit("success"),
});
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="grid sm:grid-cols-4 gap-4">
      <form.Field name="logo_file">
        <template #default="{ field }">
          <ImageUpload
            label="Logo"
            :model-value="props.merchant?.logo_url"
            @change="
              (file) => {
                logoFile = file;
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
              <FieldLabel for="field.name">
                Name <span className="text-destructive">*</span></FieldLabel
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
              <FieldLabel :for="field.name">
                Phone number <span className="text-destructive">*</span>
              </FieldLabel>
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
      <div class="sm:col-span-4">
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
        <Icon
          name="lucide:loader-2"
          v-if="loading"
          class="h-4 w-4 animate-spin"
        />
        {{ loading ? "Saving..." : "Save" }}
      </Button>
    </Field>
  </form>
</template>
