<script setup lang="ts">
definePageMeta({
  layout: "staff",
  middleware: ["auth", "outlet-gate"],
});

useSeoMeta({
  title: "TigaJajan POS | Products",
  ogTitle: "TigaJajan POS | Products",
  description: "",
  ogDescription: "",
});

const user = useSupabaseUser();
const { fetchProductsByOutlet } = useProduct();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const { data: products } = useAsyncData(
  `staff-products-${outletId.value}`,
  () => fetchProductsByOutlet(outletId.value),
);

console.log(products);
</script>

<template>
  <div></div>
</template>

<style scoped></style>
