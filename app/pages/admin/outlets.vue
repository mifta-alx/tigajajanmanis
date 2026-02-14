<script setup lang="ts">
import { getColumns } from "~/components/Outlets/column";
import type { Outlet } from "~/types/outlet";
import { refDebounced } from "@vueuse/core";
import EmptyView from "~/components/EmptyView.vue";
import DeleteDialog from "~/components/DeleteDialog.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Outlet",
});

const isModalOpen = ref(false);
const updatingIds = ref(new Set<string>());
const selectedOutlet = ref<Outlet | null>(null);
const { success, error } = useToast();

const selectedId = ref<string | null>(null);
const isDeleting = ref(false);

const { fetchOutlets, toggleStatus, deleteOutlet } = useOutlet();

const searchQuery = ref("");
const { currentPage, perPage, totalPages, paginationRange, resetPage } =
  usePagination(
    computed(() => outlets.value?.total ?? 0),
    10,
  );
const debouncedSearch = refDebounced(searchQuery, 500);
watch(debouncedSearch, () => resetPage());

const {
  data: outlets,
  pending,
  refresh,
} = useLazyAsyncData(
  "outlets",
  () =>
    fetchOutlets({
      search: debouncedSearch.value,
      page: currentPage.value,
      limit: perPage.value,
    }),
  {
    watch: [debouncedSearch, currentPage, perPage],
  },
);

const openAddModal = () => {
  selectedOutlet.value = null;
  isModalOpen.value = true;
};

const openEditModal = (product: Outlet) => {
  selectedOutlet.value = product;
  isModalOpen.value = true;
};

const onSuccessMutation = () => {
  refresh();
  isModalOpen.value = false;
};

const handleStatusChange = async (outletId: string, newStatus: boolean) => {
  updatingIds.value.add(outletId);
  try {
    await toggleStatus(outletId, newStatus);

    const targetProduct = outlets.value?.data.find((u) => u.id === outletId);
    if (targetProduct) {
      targetProduct.is_active = newStatus;
    }

    const status = newStatus ? "activated" : "deactivated";
    success(`Outlet has been ${status}`);
  } catch (err) {
    const action = newStatus ? "activate" : "deactivate";
    error(`Failed to ${action} outlet`);
    await refresh();
  } finally {
    updatingIds.value.delete(outletId);
  }
};

const outletColumns = computed(() => {
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

const confirmDeleteOutlet = async () => {
  if (!selectedId.value) return;

  isDeleting.value = true;
  try {
    await deleteOutlet(selectedId.value);
    success("Outlet deleted successfully");
    onDeleteSuccess();
  } catch (e) {
    error("Failed to delete outlet");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full space-y-4">
    <h2 class="text-2xl font-bold tracking-tight">Outlets</h2>
    <EmptyView
      v-if="!pending && outlets?.total === 0 && !debouncedSearch"
      icon="store"
      name="outlet"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search outlet..."
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
        <Button :disabled="pending" @click="openAddModal"
          ><Icon name="lucide:plus" />
          <span class="hidden lg:inline">Add Outlet</span></Button
        >
      </div>
      <DataTable
        :columns="outletColumns"
        :data="outlets?.data ?? []"
        :loading="pending"
      />

      <CustomPagination
        v-if="(outlets?.total && outlets.total > 0) || pending"
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
        name="outlet"
        :is-deleting="isDeleting"
        @confirm="confirmDeleteOutlet"
        @cancel="selectedId = null"
      />
    </div>

    <Dialog v-model:open="isModalOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{
            selectedOutlet ? "Edit Outlet" : "Add Outlet"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedOutlet
                ? "Make changes to the outlet details below."
                : "Enter the information below to add a new outlet."
            }}
          </DialogDescription>
        </DialogHeader>

        <OutletsFormDialog
          v-if="isModalOpen"
          :outlet="selectedOutlet"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
