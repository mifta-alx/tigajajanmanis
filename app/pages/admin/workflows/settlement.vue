<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import type { Stock } from "~/types/stock";
import { getLocalTimeZone, today } from "@internationalized/date";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "TigaJajan POS | Workflows > Settlement",
  ogTitle: "TigaJajan POS | Workflows > Settlement",
  description: "",
  ogDescription: "",
});

const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 500);
const { fetchStock } = useStock();
const { success, error } = useToast();

const filterDate = ref(today(getLocalTimeZone()).toString());

const {
  data: stock,
  pending,
  refresh,
} = useLazyAsyncData(
  "stock",
  () =>
    fetchStock({
      filterDate: filterDate.value || "",
      search: debouncedSearch.value || "",
    }),
  {
    watch: [debouncedSearch, filterDate],
  },
);
</script>

<template></template>

<style scoped></style>
