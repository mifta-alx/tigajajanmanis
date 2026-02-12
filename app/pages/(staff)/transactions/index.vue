<script setup lang="ts">
// import type { Transaction } from "~/types/models";
import { today, getLocalTimeZone } from "@internationalized/date";
import { formatDate } from "~/lib/utils";

definePageMeta({
  layout: "staff",
  middleware: ["auth", "outlet-gate"],
  title: "Riwayat Transaksi",
  searchPlaceholder: "Cari riwayat transaksi...",
});

const todayString = new Date();

const formattedDate = formatDate(todayString, "EEEE, d MMM yyyy");

const thisDay = ref(today(getLocalTimeZone()).toString());
const user = useSupabaseUser();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");
const { fetchTransactions } = useTransaction(); // Asumsi service lo

const transactions = useState<any[]>("transactions_cache", () => []);

const { pending, refresh } = useLazyAsyncData(
  "transactions-staff",
  async () => {
    const data = await fetchTransactions({
      date: thisDay.value,
      outletId: outletId.value,
    });
    transactions.value = data;
    return data;
  },
);

const searchQuery = useState("search_query", () => "");

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;

  const query = searchQuery.value.toLowerCase();
  return transactions.value.filter((p) => {
    return (
      p.queue_number.toLowerCase().includes(query) ||
      p.invoice_number.toLowerCase().includes(query)
    );
  });
});
</script>

<template>
  <div class="space-y-6 pb-24 pt-24">
    <StaffPageHeader
      title="Riwayat Transaksi"
      :description="formattedDate"
      :amount="`${filteredTransactions.length} Transaksi`"
      :is-pending="pending && transactions.length === 0"
    />
    <SkeletonTransactionList v-if="pending && transactions.length === 0" />
    <StaffEmptyState
      v-else-if="!pending && transactions.length === 0"
      :pending="pending"
      item-name="transasksi"
      description="Riwayat transaksi masih kosong. Lakukan penjualan melalui menu produk untuk melihat data transaksi."
      @refresh="refresh"
    />
    <StaffNotFoundState
      v-else-if="searchQuery && filteredTransactions.length === 0"
      item-name="transaksi"
    />
    <div v-else class="grid grid-cols-1 gap-3">
      <NuxtLink
        v-for="trx in filteredTransactions"
        :key="trx.id"
        :to="`/transactions/${trx.id}`"
        class="block"
      >
        <TransactionsItem :transaction="trx" />
      </NuxtLink>
    </div>
  </div>
</template>
