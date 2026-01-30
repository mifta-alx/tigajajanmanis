<script setup lang="ts">
import type { Merchant } from "~/types/models";
import { getColumns } from "~/components/Merchants/column";
import DeleteDialog from "~/components/DeleteDialog.vue";
import EmptyView from "~/components/EmptyView.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "Admin | Inventory > Merchants",
  ogTitle: "Admin | Inventory > Merchants",
  description: "",
  ogDescription: "",
});

const isModalOpen = ref(false);
const updatingIds = ref(new Set<string>());
const selectedMerchant = ref<Merchant | null>(null);
const { success, error } = useToast();
const selectedId = ref<string | null>(null);
const isDeleting = ref(false);

const { fetchMerchants, deleteMerchant, toggleStatus } = useMerchant();

const {
  data: merchants,
  pending,
  refresh,
} = useLazyAsyncData("merchants", () => fetchMerchants());

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

    const targetMerchant = merchants.value?.find((u) => u.id === merchantId);
    if (targetMerchant) {
      targetMerchant.isActive = newStatus;
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
      v-if="!pending && merchants?.length === 0"
      icon="store"
      name="merchant"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput placeholder="Search merchant..." />
            <InputGroupAddon>
              <Icon name="lucide:search" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Button variant="outline" :disabled="pending" @click="openAddModal"
          ><Icon name="lucide:plus" />
          <span class="hidden lg:inline">Add Merchant</span></Button
        >
      </div>
      <AlertDialog
        :open="!!selectedId"
        @update:open="(val) => (!val ? (selectedId = null) : null)"
      >
        <DataTable
          :columns="merchantColumns"
          :data="merchants ?? []"
          :loading="pending"
        />
        <DeleteDialog
          name="merchant"
          :is-deleting="isDeleting"
          @confirm="confirmDeleteMerchant"
          @cancel="selectedId = null"
        />
      </AlertDialog>
    </div>
    <Dialog v-model:open="isModalOpen">
      <DialogContent
        class="sm:max-w-xl"
        @open-auto-focus="(e) => e.preventDefault()"
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
