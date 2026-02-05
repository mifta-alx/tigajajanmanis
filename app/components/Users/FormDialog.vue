<script setup lang="ts">
import type { Role } from "~/types/role";
import { isInvalid } from "~/lib/utils";
import type { User } from "~/types/profiles";

const props = defineProps<{
  user?: User | null;
}>();

const isEdit = computed(() => !!props.user);
const emit = defineEmits(["success", "cancel"]);
const showPassword = ref(false);

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const { fetchOutlets } = useOutlet();
const { data: outletsResponse, pending: outletPending } = useAsyncData(
  "outlets-list",
  () => fetchOutlets(),
);

const outlets = computed(() => outletsResponse.value?.data || []);
const { form, loading } = useFormUser({
  user: props.user,
  onSuccess: () => emit("success"),
});

const currentRole = ref<Role>(form.getFieldValue("role") || "staff");
watch(currentRole, (newRole) => {
  if (newRole === "admin") {
    form.setFieldValue("outlet_id", null);
  }
});
</script>

<template>
  <form @submit.prevent="form.handleSubmit" class="space-y-4">
    <FieldGroup class="grid sm:grid-cols-2 gap-4">
      <div class="sm:col-span-2">
        <form.Field name="fullname">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Full name
                <span className="text-destructive">*</span>
              </FieldLabel>
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
            <FieldLabel :for="field.name">
              Username
              <span className="text-destructive">*</span>
            </FieldLabel>
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
            <FieldLabel :for="field.name">
              Password
              <span className="text-destructive">*</span>
            </FieldLabel>
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
                  aria-label="ShowPassword"
                  title="ShowPassword"
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

      <form.Field name="phone_number">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name">
              Phone number
              <span className="text-destructive">*</span>
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

      <form.Field name="role">
        <template #default="{ field }">
          <Field :data-invalid="isInvalid(field)">
            <FieldLabel :for="field.name">
              Role
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              :name="field.name"
              :model-value="field.state.value"
              @update:model-value="
                (val) => {
                  field.handleChange(val as Role);
                  currentRole = val as Role;
                }
              "
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
        <form.Field name="outlet_id">
          <template #default="{ field }">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Outlet
                <span v-if="currentRole === 'staff'" class="text-destructive"
                  >*</span
                >
              </FieldLabel>
              <Select
                :name="field.name"
                :model-value="field.state.value ?? ''"
                :disabled="currentRole === 'admin'"
                @update:model-value="
                  (val: any) => {
                    const finalValue =
                      val === '' || val === undefined ? null : String(val);
                    field.handleChange(finalValue);
                  }
                "
              >
                <SelectTrigger
                  :id="field.name"
                  :class="{
                    'opacity-50 pointer-events-none': currentRole === 'admin',
                  }"
                >
                  <SelectValue
                    :placeholder="
                      currentRole === 'admin'
                        ? 'All Outlets (Admin)'
                        : 'Select outlet'
                    "
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
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
                </SelectContent>
              </Select>
              <FieldError
                v-if="isInvalid(field)"
                :errors="[field.state.meta.errors[0]]"
              />
            </Field>
          </template>
        </form.Field>
      </div>
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
        <Spinner class="size-4" v-if="loading" />
        {{ loading ? "Saving..." : "Save" }}
      </Button>
    </Field>
  </form>
</template>
