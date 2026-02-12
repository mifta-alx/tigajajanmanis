<script setup lang="ts">
import type { MerchantProduct } from "~/types/product";
import type { StockLogType } from "~/types/models";
import type { CreateStockDTO } from "~/types/stock";
import { DrawerStock } from "#components";

const props = defineProps<{
  merchantId: string;
  outletId: string;
  onSuccess: () => void;
}>();

const { fetchProductByMerchant } = useProduct();
const { addBulkStock } = useStock();
const { open, close } = useDrawer();

const stockInput = ref<Record<string, number>>({});
const isSubmitting = ref(false);

const products = useState<MerchantProduct[]>(
  `stock_products_cache_${props.merchantId}`,
  () => [],
);

const { pending, refresh } = useLazyAsyncData(
  `stock-products-data-${props.merchantId}`,
  () => fetchProductByMerchant(props.outletId, props.merchantId),
  {
    transform: (data) => {
      products.value = data;
      data.forEach((p) => {
        if (stockInput.value[p.id] === undefined) {
          stockInput.value[p.id] = 0;
        }
      });
      return data;
    },
    default: () => products.value,
  },
);

const totalSelected = computed(
  () => Object.values(stockInput.value).filter((v) => v > 0).length,
);

const totalQuantity = computed(() =>
  Object.values(stockInput.value).reduce((a, b) => a + b, 0),
);

const handleSave = async () => {
  const now = new Date().toISOString().split("T")[0];
  const itemsToSubmit = Object.entries(stockInput.value)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      return {
        product_id: productId,
        outlet_id: props.outletId,
        merchant_id: props.merchantId,
        entry_date: now,
        quantity: qty,
        type: "IN" as StockLogType,
      } as Omit<CreateStockDTO, "created_by">;
    });

  isSubmitting.value = true;
  try {
    await addBulkStock(itemsToSubmit);
    const summaryCount = totalSelected.value;
    stockInput.value = {};

    open({
      type: "success",
      title: "Stok Berhasil Ditambahkan!",
      description: `${summaryCount} item produk berhasil ditambahkan ke inventaris`,
      component: DrawerStock,
      props: {
        onDone: async () => {
          close();
          await refresh();
        },
      },
    });
  } catch (err) {
    open({
      type: "error",
      title: "Gagal Menambah Stok",
      description: "Terjadi kesalahan sistem saat menyimpan data",
      component: DrawerStock,
      props: {
        isError: true,
        onDone: () => close(),
        onRetry: async () => {
          close();
          await new Promise((r) => setTimeout(r, 300));
          await handleSave();
        },
      },
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div :class="['space-y-6', totalSelected > 0 ? 'pb-28' : 'pb-18']">
    <StaffEmptyState
      v-if="!pending && products.length === 0"
      :pending="pending"
      itemName="produk"
      description="Belum ada produk yang terdaftar. Klik muat ulang untuk sinkronisasi data terbaru."
      @refresh="refresh"
    />
    <template v-else>
      <StaffPageHeader
        :is-pending="pending && products.length === 0"
        title="Tambah Stok"
        description="Katalog Produk"
        :amount="`${products.length ?? 0} SKU`"
      />
      <SkeletonProductList v-if="pending && products.length === 0" />
      <div class="grid grid-cols-1" v-else>
        <StockItem
          v-for="(p, index) in products"
          :key="p.id"
          :product="p"
          v-model="stockInput[p.id]"
          :is-last="index === products.length - 1"
        />
      </div>
      <StockFloatingBar
        :show="totalSelected > 0"
        :total-selected="totalSelected"
        :total-quantity="totalQuantity"
        :is-submitting="isSubmitting"
        :is-pending="pending && products.length === 0"
        @submit="handleSave"
      />
    </template>
  </div>
</template>
