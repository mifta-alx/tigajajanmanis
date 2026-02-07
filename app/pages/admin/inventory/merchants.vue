<script setup lang="ts">
import type { Merchant } from "~/types/merchant";
import { getColumns } from "~/components/Merchants/column";
import DeleteDialog from "~/components/DeleteDialog.vue";
import EmptyView from "~/components/EmptyView.vue";
import { refDebounced } from "@vueuse/core";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Inventory > Merchants",
});

const isModalOpen = ref(false);
const updatingIds = ref(new Set<string>());
const selectedMerchant = ref<Merchant | null>(null);
const { success, error } = useToast();

const selectedId = ref<string | null>(null);
const isDeleting = ref(false);

const { fetchMerchants, deleteMerchant, toggleStatus } = useMerchant();

const searchQuery = ref("");
const { currentPage, perPage, totalPages, paginationRange, resetPage } =
  usePagination(
    computed(() => merchants.value?.total ?? 0),
    10,
  );
const debouncedSearch = refDebounced(searchQuery, 500);
watch(debouncedSearch, () => resetPage());

const {
  data: merchants,
  pending,
  refresh,
} = useLazyAsyncData(
  "merchants",
  () =>
    fetchMerchants({
      search: debouncedSearch.value,
      page: currentPage.value,
      limit: perPage.value,
    }),
  {
    watch: [debouncedSearch, currentPage, perPage],
  },
);

const openAddModal = () => {
  selectedMerchant.value = null;
  isModalOpen.value = true;
};

const openEditModal = (merchant: Merchant) => {
  selectedMerchant.value = merchant;
  isModalOpen.value = true;
};

const onSuccessMutation = () => {
  refresh();
  isModalOpen.value = false;
};

const handleStatusChange = async (merchantId: string, newStatus: boolean) => {
  updatingIds.value.add(merchantId);
  try {
    await toggleStatus(merchantId, newStatus);

    const targetMerchant = merchants.value?.data.find(
      (u) => u.id === merchantId,
    );
    if (targetMerchant) {
      targetMerchant.is_active = newStatus;
    }

    const status = newStatus ? "activated" : "deactivated";
    success(`Merchant has been ${status}`);
  } catch (err) {
    const action = newStatus ? "activate" : "deactivate";
    error(`Failed to ${action} merchant`);
    await refresh();
  } finally {
    updatingIds.value.delete(merchantId);
  }
};

const merchantColumns = computed(() => {
  return getColumns(
    (id: string) => {
      selectedId.value = id;
    },
    handleStatusChange,
    openEditModal,
    updatingIds,
  );
});

const onDeleteSuccess = () => {
  selectedId.value = null;
  refresh();
};

const confirmDeleteMerchant = async () => {
  if (!selectedId.value) return;

  isDeleting.value = true;
  try {
    await deleteMerchant(selectedId.value);
    success("Merchant deleted successfully");
    onDeleteSuccess();
  } catch (e) {
    error("Failed to delete merchant");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full">
    <EmptyView
      v-if="!pending && merchants?.total === 0 && !debouncedSearch"
      icon="store"
      name="merchant"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search merchant..."
              @input="currentPage = 1"
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
        <Button variant="outline" :disabled="pending" @click="openAddModal"
          ><Icon name="lucide:plus" />
          <span class="hidden lg:inline">Add Merchant</span></Button
        >
      </div>
      <DataTable
        :columns="merchantColumns"
        :data="merchants?.data ?? []"
        :loading="pending"
      />
      <CustomPagination
        v-if="(merchants?.total && merchants.total > 0) || pending"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :pagination-range="paginationRange"
        :pending="pending"
        @update:page="(p) => (currentPage = p)"
        @update:per-page="(s) => (perPage = s)"
      />

      <DeleteDialog
        :open="!!selectedId"
        name="merchant"
        :is-deleting="isDeleting"
        @confirm="confirmDeleteMerchant"
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
            selectedMerchant ? "Edit Merchant" : "Add Merchant"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedMerchant
                ? "Make changes to the merchant details below."
                : "Enter the information below to add a new merchant."
            }}
          </DialogDescription>
        </DialogHeader>

        <MerchantsFormDialog
          v-if="isModalOpen"
          :merchant="selectedMerchant"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
