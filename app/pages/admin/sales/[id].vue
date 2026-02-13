<script setup lang="ts">
import { formatDate, formatPrice } from "~/lib/utils";
import {
  PaymentMethodString,
  type TransactionDetail,
} from "~/types/transaction";
import { getColumns } from "~/components/Transactions/item-column";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Sales",
});

const route = useRoute();
const { getTransactionById } = useTransaction();
const selectedTransaction = route.params.id as string;

const { data: transaction, pending } =
  useLazyAsyncData<TransactionDetail | null>(
    `sales-detail-${selectedTransaction}`,
    () => getTransactionById(selectedTransaction),
  );

const productColumns = computed(() => {
  return getColumns();
});
</script>

<template>
  <div>
    <SkeletonDetailTransactionAdmin v-if="pending && !transaction" />
    <div v-else-if="transaction" class="space-y-6">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2"
      >
        <div class="space-y-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
              Order {{ transaction.queue_number }}
            </h1>
            <Badge
              class="bg-primary/10 text-primary border-primary/20 rounded-full font-bold"
            >
              {{ PaymentMethodString[transaction.payment_type] }}
            </Badge>
          </div>
          <p
            class="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]"
          >
            {{ transaction.invoice_number }}
          </p>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <button
            @click="$router.back()"
            class="flex-1 md:flex-none px-4 py-2.5 rounded-full border bg-card font-bold text-xs flex items-center justify-center gap-2"
          >
            <Icon name="lucide:arrow-left" class="size-4" />
            Back
          </button>
          <button
            class="flex-1 md:flex-none px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Icon name="lucide:printer" class="size-4" />
            Print
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          class="border border-border/60 rounded-[1.5rem] p-5 flex items-center gap-4"
        >
          <div
            class="size-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <Icon name="lucide:store" class="size-5 text-muted-foreground" />
          </div>
          <div>
            <p
              class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Outlet
            </p>
            <p class="text-sm font-semibold">{{ transaction.outlets.name }}</p>
          </div>
        </div>

        <div
          class="border border-border/60 rounded-[1.5rem] p-5 flex items-center gap-4"
        >
          <div
            class="size-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <Icon name="lucide:user" class="size-5 text-muted-foreground" />
          </div>
          <div>
            <p
              class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Petugas
            </p>
            <p class="text-sm font-semibold">
              {{ transaction.profiles.fullname }}
            </p>
          </div>
        </div>

        <div
          class="border border-border/60 rounded-[1.5rem] p-5 flex items-center gap-4"
        >
          <div
            class="size-10 rounded-xl bg-muted flex items-center justify-center"
          >
            <Icon name="lucide:calendar" class="size-5 text-muted-foreground" />
          </div>
          <div>
            <p
              class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
            >
              Waktu
            </p>
            <p class="text-sm font-semibold">
              {{ formatDate(transaction.created_at, "dd MMM yyyy, HH:mm") }}
            </p>
          </div>
        </div>
      </div>

      <Card class="overflow-hidden rounded-[1.5rem] border border-border/60">
        <p class="text-xl font-medium px-8 pt-2">Order Detail</p>

        <div class="p-2">
          <TransactionsDetailTable
            :columns="productColumns"
            :data="transaction.transaction_items ?? []"
            :loading="pending"
          />
        </div>

        <div class="px-8 pb-2 flex flex-row justify-end items-start gap-8">
          <div
            class="w-full md:w-[320px] bg-muted/30 p-6 rounded-2xl border border-border/60 space-y-3"
          >
            <div class="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span class="font-bold text-foreground">{{
                formatPrice(transaction.total_price)
              }}</span>
            </div>
            <div class="flex justify-between text-sm text-muted-foreground">
              <span>Pajak</span>
              <span class="font-bold text-emerald-600">Rp 0</span>
            </div>
            <div
              class="border-t border-dashed pt-3 flex justify-between items-center"
            >
              <span class="text-sm font-bold uppercase">Total</span>
              <span class="text-2xl font-black text-primary">{{
                formatPrice(transaction.total_price)
              }}</span>
            </div>

            <div class="bg-muted p-3 rounded-lg space-y-1">
              <div
                class="flex justify-between text-[10px] font-semibold uppercase opacity-50"
              >
                <span>Diterima</span>
                <span>{{ formatPrice(transaction.cash_received) }}</span>
              </div>
              <div
                class="flex justify-between text-[10px] font-semibold uppercase text-primary"
              >
                <span>Kembali</span>
                <span>{{ formatPrice(transaction.cash_change) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
