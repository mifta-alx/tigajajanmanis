<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "Admin | Dashboard",
  ogTitle: "Admin | Dashboard",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <h1>Dashboard</h1>
</template>
