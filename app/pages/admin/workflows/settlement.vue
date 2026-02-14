<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { getLocalTimeZone, today } from "@internationalized/date";
import { getColumns } from "~/components/Settlement/column";
import type { Stock } from "~/types/stock";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Workflows > Settlement",
});

const isModalOpen = ref(false);
const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 500);
const isReturning = ref(false);
const selectedStock = ref<Stock | null>(null);
const { fetchStock, settleProduct } = useStock();
const { success, error } = useToast();

const filterDate = ref(today(getLocalTimeZone()).toString());

const {
  data: stock,
  pending,
  refresh,
} = useLazyAsyncData(
  "settlement",
  () =>
    fetchStock({
      filterDate: filterDate.value || "",
      search: debouncedSearch.value || "",
      isGrouped: true,
    }),
  {
    watch: [debouncedSearch, filterDate],
  },
);

const openConfirmationModal = (log: Stock) => {
  selectedStock.value = log;
  isModalOpen.value = true;
};

const stockColumns = computed(() => {
  return getColumns(openConfirmationModal);
});

const onReturnSuccess = () => {
  selectedStock.value = null;
  refresh();
};

const confirmReturnStock = async () => {
  if (!selectedStock.value) return;

  isReturning.value = true;
  try {
    await settleProduct(selectedStock.value);
    success("Stock returned successfully");
    onReturnSuccess();
  } catch (e) {
    error("Failed to process stock return");
  } finally {
    isReturning.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full space-y-4">
    <h2 class="text-2xl font-bold tracking-tight">Settlement</h2>
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search product..."
            />
            <InputGroupAddon>
              <Spinner v-if="pending && searchQuery" class="size-3.5" />
              <Icon v-else name="lucide:search" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" v-if="searchQuery">
              <InputGroupButton
                type="button"
                variant="ghost"
                aria-label="Clear"
                title="Clear"
                size="icon-xs"
                @click="searchQuery = ''"
              >
                <Icon name="lucide:x" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class="w-full flex gap-4 justify-end">
          <DatePicker
            v-model="filterDate"
            class="flex flex-1 sm:flex-none sm:w-max"
          />
        </div>
      </div>
      <DataTable
        :columns="stockColumns"
        :data="stock?.data ?? []"
        :loading="pending"
      />

      <SettlementConfirmationDialog
        :open="!!selectedStock"
        :name="selectedStock?.product_name || ''"
        :quantity="selectedStock?.current_stock"
        :is-returning="isReturning"
        @confirm="confirmReturnStock"
        @cancel="selectedStock = null"
      />
    </div>
  </div>
</template>

<style scoped></style>
