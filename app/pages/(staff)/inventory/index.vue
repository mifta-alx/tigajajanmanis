<script setup lang="ts">
import type { SimpleMerchants } from "~/types/merchant";

definePageMeta({
  layout: "staff",
  middleware: ["auth", "outlet-gate"],
  title: "Inventaris",
  searchPlaceholder: "Cari penitip...",
});

const user = useSupabaseUser();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const { fetchSimpleMerchants } = useMerchant();

const merchants = useState<SimpleMerchants[]>("merchants_cache", () => []);

const { pending, refresh } = useLazyAsyncData("merchants-staff", async () => {
  const data = await fetchSimpleMerchants(true, outletId.value);
  merchants.value = data;
  return data;
});

const searchQuery = useState("search_query", () => "");

// Buat computed untuk memfilter
const filteredMerchants = computed(() => {
  if (!searchQuery.value) return merchants.value;

  const query = searchQuery.value.toLowerCase();
  return merchants.value.filter((p) => {
    return p.name.toLowerCase().includes(query);
  });
});
</script>

<template>
  <div class="space-y-6 pb-8 pt-24">
    <StaffPageHeader
      title="Katalog"
      description="Inventaris"
      :amount="`${filteredMerchants.length} penitip`"
      :is-pending="pending && merchants.length === 0"
    />
    <SkeletonMerchantList v-if="pending && merchants.length === 0" />
    <StaffEmptyState
      v-else-if="!pending && merchants.length === 0"
      :pending="pending"
      item-name="penitip"
      description="Belum ada penitip yang terdaftar. Klik muat ulang untuk sinkronisasi data terbaru."
      @refresh="refresh"
    />
    <StaffNotFoundState
      v-else-if="searchQuery && filteredMerchants.length === 0"
      item-name="penitip"
    />
    <div v-else class="grid grid-cols-2 gap-4">
      <MerchantsItem
        v-for="merchant in filteredMerchants"
        :key="merchant.id"
        :merchant="merchant"
        :is-pending="pending"
      />
    </div>
  </div>
</template>
