<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { getColumns } from "~/components/Stock/column";
import { today, getLocalTimeZone } from "@internationalized/date";
import DeleteDialog from "~/components/DeleteDialog.vue";
import type { Stock } from "~/types/stock";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "TigaJajan POS | Workflows > Stock In",
  ogTitle: "TigaJajan POS | Workflows > Stock In",
  description: "",
  ogDescription: "",
});

const isModalOpen = ref(false);
const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 500);
const isDeleting = ref(false);
const selectedId = ref<string | null>(null);
const selectedStock = ref<Stock | null>(null);
const { fetchStock, deleteStockLog } = useStock();
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

const openAddModal = () => {
  selectedStock.value = null;
  isModalOpen.value = true;
};

const openEditModal = (log: Stock) => {
  selectedStock.value = log;
  isModalOpen.value = true;
};

const onSuccessMutation = () => {
  refresh();
  isModalOpen.value = false;
};

const stockColumns = computed(() => {
  return getColumns((id: string) => {
    selectedId.value = id;
  }, openEditModal);
});

const onDeleteSuccess = () => {
  selectedId.value = null;
  refresh();
};

const confirmDeleteStockLog = async () => {
  if (!selectedId.value) return;

  isDeleting.value = true;
  try {
    await deleteStockLog(selectedId.value);
    success("Log deleted successfully");
    onDeleteSuccess();
  } catch (e) {
    error("Failed to delete log");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full">
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
          <Button variant="outline" :disabled="pending" @click="openAddModal"
            ><Icon name="lucide:plus" />
            <span class="hidden lg:inline">Add Stock</span></Button
          >
        </div>
      </div>
      <DataTable
        :columns="stockColumns"
        :data="stock?.data ?? []"
        :loading="pending"
      />

      <DeleteDialog
        :open="!!selectedId"
        name="log"
        :is-deleting="isDeleting"
        @confirm="confirmDeleteStockLog"
        @cancel="selectedId = null"
      />
    </div>

    <Dialog v-model:open="isModalOpen">
      <DialogContent
        class="sm:max-w-xl"
        @interact-outside="(event) => event.preventDefault()"
      >
        <DialogHeader>
          <DialogTitle>{{
            selectedStock ? "Edit Stock" : "Add Stock"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedStock
                ? "Adjust the quantity for this entry."
                : "Add new product stock entries."
            }}
          </DialogDescription>
        </DialogHeader>

        <StockFormDialog
          v-if="isModalOpen && !selectedStock"
          :initial-date="filterDate"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />

        <StockEditDialog
          v-if="isModalOpen && selectedStock"
          :stock="selectedStock"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
