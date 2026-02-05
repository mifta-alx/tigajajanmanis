<script setup lang="ts">
import type { Product } from "~/types/product";
import { refDebounced } from "@vueuse/core";
import { getColumns } from "~/components/Products/column";
import EmptyView from "~/components/EmptyView.vue";
import DeleteDialog from "~/components/DeleteDialog.vue";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "TigaJajan POS | Inventory > Products",
  ogTitle: "TigaJajan POS | Inventory > Products",
  description: "",
  ogDescription: "",
});

const isModalOpen = ref(false);
const updatingIds = ref(new Set<string>());
const selectedProduct = ref<Product | null>(null);
const { success, error } = useToast();

const selectedId = ref<string | null>(null);
const isDeleting = ref(false);

const { fetchProducts, toggleStatus, deleteProduct } = useProduct();

const searchQuery = ref("");
const { currentPage, perPage, totalPages, paginationRange, resetPage } =
  usePagination(
    computed(() => products.value?.total ?? 0),
    10,
  );
const debouncedSearch = refDebounced(searchQuery, 500);
watch(debouncedSearch, () => resetPage());

const {
  data: products,
  pending,
  refresh,
} = useLazyAsyncData(
  "products",
  () =>
    fetchProducts({
      search: debouncedSearch.value,
      page: currentPage.value,
      limit: perPage.value,
    }),
  {
    watch: [debouncedSearch, currentPage, perPage],
  },
);

const openAddModal = () => {
  selectedProduct.value = null;
  isModalOpen.value = true;
};

const openEditModal = (product: Product) => {
  selectedProduct.value = product;
  isModalOpen.value = true;
};

const onSuccessMutation = () => {
  refresh();
  isModalOpen.value = false;
};

const handleStatusChange = async (productId: string, newStatus: boolean) => {
  updatingIds.value.add(productId);
  try {
    await toggleStatus(productId, newStatus);

    const targetProduct = products.value?.data.find((u) => u.id === productId);
    if (targetProduct) {
      targetProduct.is_active = newStatus;
    }

    const status = newStatus ? "activated" : "deactivated";
    success(`Product has been ${status}`);
  } catch (err) {
    const action = newStatus ? "activate" : "deactivate";
    error(`Failed to ${action} product`);
    await refresh();
  } finally {
    updatingIds.value.delete(productId);
  }
};

const productColumns = computed(() => {
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

const confirmDeleteProduct = async () => {
  if (!selectedId.value) return;

  isDeleting.value = true;
  try {
    await deleteProduct(selectedId.value);
    success("Product deleted successfully");
    onDeleteSuccess();
  } catch (e) {
    error("Failed to delete product");
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-0 h-full">
    <EmptyView
      v-if="!pending && products?.total === 0 && !debouncedSearch"
      icon="cake-slice"
      name="product"
      :on-create="openAddModal"
    />
    <div v-else class="space-y-4">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div class="w-full md:max-w-sm">
          <InputGroup>
            <InputGroupInput
              v-model="searchQuery"
              placeholder="Search product..."
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
          <span class="hidden lg:inline">Add Product</span></Button
        >
      </div>
      <DataTable
        :columns="productColumns"
        :data="products?.data ?? []"
        :loading="pending"
      />

      <CustomPagination
        v-if="(products?.total && products.total > 0) || pending"
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
        name="product"
        :is-deleting="isDeleting"
        @confirm="confirmDeleteProduct"
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
            selectedProduct ? "Edit Product" : "Add Product"
          }}</DialogTitle>
          <DialogDescription>
            {{
              selectedProduct
                ? "Make changes to the product details below."
                : "Enter the information below to add a new product."
            }}
          </DialogDescription>
        </DialogHeader>

        <ProductsFormDialog
          v-if="isModalOpen"
          :product="selectedProduct"
          @success="onSuccessMutation"
          @cancel="isModalOpen = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>
