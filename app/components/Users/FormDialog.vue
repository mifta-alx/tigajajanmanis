<script setup lang="ts">
import type { User } from "~/types/models";
import { z } from "zod";
import { useForm } from "@tanstack/vue-form";
import type { Role } from "~/types/role";

const props = defineProps<{
  user?: User | null;
}>();

const { createUser, updateUser } = useUser();
const { success, error } = useToast();
const showPassword = ref(false);
const emit = defineEmits(["success", "cancel"]);

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const loading = ref(false);
const isEdit = computed(() => !!props.user);

const formSchema = z.object({
  username: isEdit.value
    ? z.string()
    : z
        .string()
        .toLowerCase()
        .trim()
        .min(1, "Username is required")
        .min(5, "Username must be at least 5 characters.")
        .max(32, "Username must be at most 20 characters.")
        .regex(/^\S+$/, "Username cannot contain spaces"),

  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),

  password: isEdit.value
    ? z.string()
    : z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),

  address: z.string(),

  role: z.custom<Role>((val) => ["admin", "staff"].includes(val as Role), {
    message: "Please select a valid role",
  }),
});

const form = useForm({
  defaultValues: {
    username: props.user?.username ?? "",
    fullName: props.user?.fullName ?? "",
    password: "",
    phoneNumber: props.user?.phoneNumber ?? "",
    address: props.user?.address ?? "",
    role: (props.user?.role as Role) ?? ("" as Role),
  },
  validators: {
    onSubmit: formSchema,
  },
  onSubmit: async ({ value }) => {
    loading.value = true;
    const actionText = isEdit.value ? "updated" : "created";
    try {
      if (isEdit.value && props.user) {
        await updateUser(props.user.id, {
          fullName: value.fullName,
          phoneNumber: value.phoneNumber,
          address: value.address,
          role: value.role as Role,
        });
      } else {
        await createUser({ ...value, status: 1 });
      }
      success(`User ${actionText} successfully`);
      emit("success");
    } catch (err) {
      error(`Failed to ${actionText} user`);
    } finally {
      loading.value = false;
    }
  },
});

function isInvalid(field: any) {
  return field.state.meta.isTouched && !field.state.meta.isValid;
}
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <form.Field name="fullName">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel for="field.name"> Full name </FieldLabel>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder="Enter a full name"
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

      <form.Field name="username" v-if="!isEdit">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name"> Username </FieldLabel>
            <Input
              :id="field.name"
              :name="field.name"
              :model-value="field.state.value"
              :aria-invalid="isInvalid(field)"
              placeholder="Enter a username"
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

      <form.Field name="password" v-if="!isEdit">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name"> Password </FieldLabel>
            <InputGroup>
              <InputGroupInput
                :type="showPassword ? 'text' : 'password'"
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                placeholder=""
                autocomplete=""
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  aria-label="Copy"
                  title="Copy"
                  size="icon-xs"
                  @click="handleShowPassword"
                >
                  <Icon :name="`lucide:${showPassword ? 'eye-off' : 'eye'}`" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError
              v-if="isInvalid(field)"
              :errors="[field.state.meta.errors[0]]"
            />
          </Field>
        </template>
      </form.Field>

      <form.Field name="phoneNumber">
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

      <form.Field name="role">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name"> Role </FieldLabel>
            <Select
              :name="field.name"
              :model-value="field.state.value"
              @update:model-value="(val) => field.handleChange(val as Role)"
            >
              <SelectTrigger :id="field.name" :aria-invalid="isInvalid(field)">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="admin"> Admin </SelectItem>
                <SelectItem value="staff"> Staff </SelectItem>
              </SelectContent>
            </Select>
            <FieldError
              v-if="isInvalid(field)"
              :errors="[field.state.meta.errors[0]]"
            />
          </Field>
        </template>
      </form.Field>

      <div class="sm:col-span-2">
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
