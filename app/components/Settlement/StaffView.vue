<script setup lang="ts">
import { FileCheck2 } from "lucide-vue-next";
import type { CreateStockDTO, SettlementProduct } from "~/types/stock";

const props = defineProps<{
  merchantId: string;
  outletId: string;
  onSuccess: () => void;
}>();

const selectedProducts = ref<Record<string, boolean>>({});
const { fetchSettlementWorklist, addBulkStock } = useStock();

const stocks = useState<SettlementProduct[]>(
  `settlement_cache_${props.merchantId}`,
  () => [],
);

const { pending, refresh } = useLazyAsyncData(
  `settlement-data-${props.merchantId}`,
  async () => {
    if (!props.outletId || !props.merchantId) return { data: [], total: 0 };

    return fetchSettlementWorklist({
      outletId: props.outletId,
      merchantId: props.merchantId,
    });
  },
  {
    transform: (response) => {
      stocks.value = response.data;
      return response.data;
    },
    default: () => stocks.value,
  },
);

const handleToggleReturn = (productId: string) => {
  selectedProducts.value[productId] = !selectedProducts.value[productId];
};

const totalSelectedItems = computed(
  () => Object.values(selectedProducts.value).filter((v) => v).length,
);

const totalStockToSettle = computed(() => {
  return stocks.value
    .filter((p) => selectedProducts.value[p.product_id])
    .reduce((acc, curr) => acc + curr.current_stock, 0);
});

const isSubmitting = ref(false);
const isModalOpen = ref(false);

const openConfirmation = async () => {
  isModalOpen.value = true;
};

const confirmFinalSave = async () => {
  const payload: Omit<CreateStockDTO, "created_by">[] = stocks.value
    .filter((p) => selectedProducts.value[p.product_id])
    .map((p) => ({
      product_id: p.product_id,
      outlet_id: props.outletId,
      merchant_id: props.merchantId,
      entry_date: p.entry_date,
      quantity: p.current_stock ?? 0,
      type: "OUT_SETTLE",
    }));
  isSubmitting.value = true;

  try {
    await addBulkStock(payload);
    selectedProducts.value = {};
    await refresh();
    props.onSuccess();
  } catch (err: any) {
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const productsToSettle = computed(() => {
  return stocks.value.filter((p) => selectedProducts.value[p.product_id]);
});
</script>

<template>
  <div :class="['space-y-6', totalSelectedItems > 0 ? 'pb-28' : 'pb-18']">
    <template v-if="pending && stocks.length === 0">
      <SkeletonHeader />
      <SkeletonProductList />
      <SkeletonFloatingBar />
    </template>
    <template v-else>
      <StaffPageHeader
        :is-pending="pending && stocks.length === 0"
        title="Pengembalian Stok"
        description="Katalog Produk"
        :amount="`${stocks.length ?? 0} SKU`"
      />
      <SettlementWarningMessage />
      <div class="grid grid-cols-1">
        <SettlementItem
          v-for="stock in stocks"
          :key="stock.product_id"
          :stock="stock"
          :is-selected="!!selectedProducts[stock.product_id]"
          @toggle="handleToggleReturn"
        />
      </div>

      <SettlementFloatingBar
        :show="totalSelectedItems > 0"
        :total-items="totalSelectedItems"
        :total-stock="totalStockToSettle"
        @submit="openConfirmation"
      />

      <SettlementVerificationDialog
        v-model:open="isModalOpen"
        :selected-products="productsToSettle"
        :is-submitting="isSubmitting"
        @confirm="confirmFinalSave"
      />
    </template>
  </div>
</template>
