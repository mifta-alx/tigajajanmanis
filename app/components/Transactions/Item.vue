<script setup lang="ts">
import { formatPrice } from "~/lib/utils";
import { parseAbsoluteToLocal } from "@internationalized/date";
import type { PaymentMethodType } from "~/types/models";
const props = defineProps<{
  transaction: any;
}>();

const transactionTime = computed(() => {
  const zdt = parseAbsoluteToLocal(props.transaction.created_at);
  return `${zdt.hour.toString().padStart(2, "0")}:${zdt.minute.toString().padStart(2, "0")}`;
});

const paymentMethod = {
  CASH: "Tunai",
  DEBIT: "Debit",
  QRIS: "QRIS Statis",
  TRANSFER: "Transfer",
};
</script>

<template>
  <button
    @click="$emit('click')"
    class="w-full bg-card border border-border/50 rounded-[1.5rem] p-4 flex flex-col active:scale-[0.98] transition-all hover:bg-secondary/20 group"
  >
    <div
      class="flex items-center justify-between border-b border-border/50 w-full pb-3"
    >
      <div class="flex flex-col items-start gap-1.5 text-left">
        <h4
          class="text-base font-bold uppercase tracking-tight text-foreground leading-none"
        >
          {{ transaction.queue_number }}
        </h4>
        <p class="text-xs font-normal text-muted-foreground uppercase">
          {{ transactionTime }}
        </p>
      </div>

      <div class="text-right flex items-end justify-end flex-col gap-1.5">
        <p class="text-base font-bold text-primary leading-none">
          {{ formatPrice(transaction.total_price) }}
        </p>
        <Badge variant="secondary">
          {{ paymentMethod[transaction.payment_type as PaymentMethodType] }}
        </Badge>
      </div>
    </div>
    <div class="flex items-center justify-between w-full pt-3">
      <div class="flex items-center gap-4 text-left">
        <p class="text-xs font-normal text-muted-foreground mt-0.5">
          {{ transaction?.transaction_items.length }} Produk
        </p>
      </div>

      <div class="text-right flex items-center gap-1 text-primary">
        <p class="text-xs font-medium">Lihat Detail</p>
        <Icon name="lucide:chevron-right" />
      </div>
    </div>
  </button>
</template>
