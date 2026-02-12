<script setup lang="ts">
import type { SimpleMerchants } from "~/types/merchant";

definePageMeta({
  layout: "focused",
  middleware: ["auth", "outlet-gate"],
  title: "Katalog Produk",
});

const route = useRoute();
const user = useSupabaseUser();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");
const selectedMerchant = route.params.id as string;

const merchantsCache = useState<SimpleMerchants[]>("merchants_cache", () => []);

const currentMerchant = merchantsCache.value.find(
  (m) => m.id === selectedMerchant,
);

if (currentMerchant) {
  route.meta.title = currentMerchant.name;
}
const { checkExistingStock } = useStock();

const hasExistingStock = ref(false);
const isChecking = ref(true);

const updateStatus = async () => {
  isChecking.value = true;
  const { hasStock, merchantName } = await checkExistingStock(
    outletId.value,
    selectedMerchant,
  );
  hasExistingStock.value = hasStock;

  if (merchantName) {
    route.meta.title = merchantName;
  }

  isChecking.value = false;
};

onMounted(updateStatus);
</script>

<template>
  <div class="space-y-6">
    <template v-if="isChecking">
      <SkeletonHeader />
      <SkeletonProductList />
      <SkeletonFloatingBar />
    </template>
    <SettlementStaffView
      v-else-if="hasExistingStock"
      :merchant-id="selectedMerchant"
      :outlet-id="outletId"
      :on-success="updateStatus"
    />
    <StockStaffView
      v-else
      :outlet-id="outletId"
      :merchant-id="selectedMerchant"
      :on-success="updateStatus"
    />
  </div>
</template>
