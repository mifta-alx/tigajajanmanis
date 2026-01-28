<script setup lang="ts">
import type { AuthErrorResponse } from "~/types/models";

const { login, loading } = useAuth();
const showAlert = ref(false);
const showPassword = ref(false);
const errorMessage = ref<AuthErrorResponse>({
  title: "",
  description: "",
});

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const formLogin = ref({
  username: "",
  password: "",
});

const touched = ref({ username: false, password: false });

const errors = computed(() => ({
  username:
    touched.value.username && !formLogin.value.username
      ? "Username is required"
      : "",
  password:
    touched.value.password && !formLogin.value.password
      ? "Password is required"
      : "",
}));

const handleLogin = async () => {
  touched.value = { username: true, password: true };

  if (errors.value.username || errors.value.password) return;

  const { error } = await login(
    formLogin.value.username,
    formLogin.value.password,
  );

  if (error) {
    showAlert.value = true;
    errorMessage.value = error;

    setTimeout(() => {
      showAlert.value = false;
    }, 5000);
  } else {
    const client = useSupabaseClient();
    await client.auth.getSession();
    await navigateTo("/admin/dashboard", {
      replace: true,
      external: false,
    });
  }
};
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleLogin">
    <FieldGroup>
      <div class="flex flex-col items-center gap-1 text-center">
        <h1 class="text-2xl font-bold">Login to your account</h1>
        <p class="text-muted-foreground text-sm text-balance">
          Enter your credentials below to login to your account
        </p>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
      >
        <Alert variant="destructive" v-if="showAlert">
          <Icon name="lucide:circle-alert" mode="svg" />
          <AlertTitle>{{ errorMessage.title }}</AlertTitle>
          <AlertDescription>
            <p class="text-xs">{{ errorMessage.description }}</p>
          </AlertDescription>
        </Alert>
      </Transition>

      <Field :data-invalid="!!errors.username">
        <FieldLabel for="username"> Username </FieldLabel>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          v-model="formLogin.username"
          @blur="touched.username = true"
          :aria-invalid="!!errors.username"
        />
        <FieldError v-if="errors.username" :errors="[errors.username]" />
      </Field>
      <Field :data-invalid="!!errors.password">
        <FieldLabel for="password"> Password </FieldLabel>
        <InputGroup>
          <InputGroupInput
            :type="showPassword ? 'text' : 'password'"
            id="password"
            name="password"
            v-model="formLogin.password"
            @blur="touched.password = true"
            placeholder=""
            :aria-invalid="!!errors.password"
            autocomplete="false"
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
        <FieldError v-if="errors.password" :errors="[errors.password]" />
      </Field>
      <Field>
        <Button type="submit" :disabled="loading">
          {{ loading ? "Memproses..." : "Login" }}
        </Button>
      </Field>
      <Field>
        <FieldDescription class="text-center flex flex-col">
          <span class="text-xs text-muted-foreground leading-relaxed">
            Forgot your password or can't login? <br />
            Please contact your <strong>System Administrator</strong> to reset
            your credentials.
          </span>
          <span
            class="text-center text-[10px] text-muted-foreground/50 mt-6 tracking-widest uppercase"
          >
            Tiga Jajan POS System v1.0.0 &copy; 2026
          </span>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
