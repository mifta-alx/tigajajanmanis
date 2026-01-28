<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "Admin | Catalog > Products",
  ogTitle: "Catalog > Products",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <h1>Products</h1>
</template>
