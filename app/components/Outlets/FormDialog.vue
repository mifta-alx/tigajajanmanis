<script setup lang="ts">
import { isInvalid } from "~/lib/utils";
import type { Outlet } from "~/types/outlet";
import { useFormOutlet } from "~/composables/useFormOutlet";

const props = defineProps<{
  outlet?: Outlet | null;
}>();

const emit = defineEmits(["success", "cancel"]);

const { form, loading } = useFormOutlet({
  outlet: props.outlet,
  onSuccess: () => emit("success"),
});
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="gap-4">
      <form.Field name="name">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name">
              Outlet name
              <span className="text-destructive">*</span></FieldLabel
            >
            <Input
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="isInvalid(field)"
              placeholder="Enter a outlet name"
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
