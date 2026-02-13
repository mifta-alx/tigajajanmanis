<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { getColumns } from "~/components/Transactions/column";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Sales",
});

const { fetchTransactions } = useTransaction();

const filterDate = ref<any>(undefined);
const dateKey = ref(0);

const handleResetDate = () => {
  filterDate.value = undefined;
  dateKey.value++;
  refresh();
};

const searchQuery = ref("");
const { currentPage, perPage, totalPages, paginationRange, resetPage } =
  usePagination(
    computed(() => transactions.value?.total ?? 0),
    10,
  );
const debouncedSearch = refDebounced(searchQuery, 500);
watch(debouncedSearch, () => resetPage());

const {
  data: transactions,
  pending,
  refresh,
} = useLazyAsyncData(
  "sales",
  () => {
    const dateParam = filterDate.value ? String(filterDate.value) : "";
    return fetchTransactions({
      date: dateParam,
      search: debouncedSearch.value || "",
    });
  },
  {
    watch: [debouncedSearch, filterDate],
  },
);

const transactionColumns = computed(() => {
  return getColumns();
});
</script>

<template>
  <div class="min-h-0 h-full">
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search transactions..."
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
        <div class="w-full flex gap-2 justify-end items-center">
          <DatePicker
            :key="dateKey"
            v-model="filterDate"
            class="flex flex-1 sm:flex-none sm:w-max"
          />
          <Button
            v-if="filterDate"
            variant="ghost"
            size="icon"
            @click="handleResetDate"
            class="h-10 w-10 border"
          >
            <Icon name="lucide:rotate-ccw" class="size-4" />
          </Button>
        </div>
      </div>
      <DataTable
        :columns="transactionColumns"
        :data="transactions ?? []"
        :loading="pending"
      />

      <CustomPagination
        v-if="(transactions && transactions.length > 0) || pending"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :pagination-range="paginationRange"
        :pending="pending"
        @update:page="(p) => (currentPage = p)"
        @update:per-page="(s) => (perPage = s)"
      />
    </div>
  </div>
</template>
