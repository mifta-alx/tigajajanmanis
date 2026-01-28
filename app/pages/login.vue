<script setup lang="ts">
import { Cookie } from "lucide-vue-next";
useSeoMeta({
  title: "TigaJajan | Login",
  ogTitle: "TigaJajan | Login",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <a href="#" class="flex items-center gap-2 font-medium">
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
          >
            <Cookie class="size-4" />
          </div>
          TigaJajan.
        </a>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <Login />
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:block">
      <NuxtImg
        src="/images/login-cover.webp"
        alt="login cover"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
