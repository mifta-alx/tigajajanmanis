<script setup lang="ts">
import { cn, formatNumberPrice, formatPrice } from "~/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { PaymentMethodType, TransactionStatusType } from "~/types/models";
import {
  PaymentMethodString,
  TransactionStatusConfig,
} from "~/types/transaction";

definePageMeta({
  layout: "focused",
  middleware: ["auth", "outlet-gate"],
  title: "Detail Transaksi",
});

const route = useRoute();
const selectedTransaction = route.params.id as string;
const { getTransactionById } = useTransaction();

const transaction = useState<any>(
  `transaction-${selectedTransaction}`,
  () => null,
);

const { pending } = useLazyAsyncData(
  `transaction-detail-${selectedTransaction}`,
  async () => {
    const data = await getTransactionById(selectedTransaction);
    transaction.value = data;
    return data;
  },
);

const formatDate = (dateStr: string, formatStr: string) => {
  if (!dateStr) return "-";
  return format(new Date(dateStr), formatStr, { locale: id });
};

const currentStatus = computed(() => {
  const status = transaction.value?.status as TransactionStatusType;
  return (
    TransactionStatusConfig[status as keyof typeof TransactionStatusConfig] ||
    TransactionStatusConfig.PENDING
  );
});
</script>

<template>
  <SkeletonDetailTransaction v-if="pending && !transaction" />
  <div v-else-if="transaction" class="bg-background space-y-6 py-6">
    <div class="relative flex items-center justify-center size-24 mx-auto">
      <div
        :class="
          cn(
            'absolute inset-0 rounded-full animate-pulse',
            currentStatus.lightBg,
          )
        "
      />
      <div
        :class="
          cn(
            'relative size-14 rounded-full flex items-center justify-center text-white',
            currentStatus.bg,
          )
        "
      >
        <Icon
          :name="currentStatus.icon"
          class="size-8 animate-in zoom-in duration-500 stroke-[4]"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h2
        :class="
          cn(
            'text-2xl font-bold tracking-tight text-center',
            currentStatus.color,
          )
        "
      >
        Pembayaran {{ currentStatus.label }}
      </h2>
      <h2
        class="text-3xl font-bold tracking-tighter text-foreground text-center"
      >
        {{ formatPrice(transaction.total_price) }}
      </h2>
    </div>
    <div class="space-y-6">
      <div
        class="space-y-2.5 bg-secondary/20 p-4 rounded-2xl border border-border/40"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">Antrian</p>
          <p class="text-sm font-mono font-medium text-foreground">
            {{ transaction.queue_number }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">ID Transaksi</p>
          <p class="text-sm font-mono font-medium text-foreground">
            {{ transaction.invoice_number }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">Waktu</p>
          <p class="text-sm font-medium text-foreground">
            {{ formatDate(transaction.created_at, "dd MMM yyyy, HH:mm") }} WIB
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">Metode</p>
          <p class="text-sm font-medium text-foreground">
            {{
              PaymentMethodString[transaction.payment_type as PaymentMethodType]
            }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">Pegawai</p>
          <p class="text-sm font-medium text-foreground">
            {{ transaction.profiles.fullname }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm text-muted-foreground">Status</p>
          <p :class="cn('text-sm font-semibold', currentStatus.color)">
            {{ currentStatus.label }}
          </p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="h-4 w-1 bg-primary rounded-full"></div>
          <h3
            class="text-sm font-bold uppercase tracking-wider text-muted-foreground"
          >
            Rincian Pesanan
          </h3>
        </div>

        <div class="space-y-3 px-2">
          <div
            class="flex items-start justify-between gap-4"
            v-for="(item, index) in transaction.transaction_items"
            :key="index"
          >
            <div class="flex flex-col gap-0.5">
              <p class="text-base leading-tight text-foreground font-semibold">
                {{ item.products.name }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ item.quantity }}x @{{
                  formatNumberPrice(item.selling_price_at_time)
                }}
              </p>
            </div>
            <p
              class="text-base font-semibold text-foreground whitespace-nowrap"
            >
              {{ formatPrice(item.subtotal) }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-1.5 border-t border-dashed border-border/60 pt-4">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm tracking-tight text-muted-foreground">
            Subtotal ({{ transaction.total_items }} Item)
          </p>
          <p class="text-sm tracking-tight text-foreground font-semibold">
            {{ formatPrice(transaction.total_price) }}
          </p>
        </div>

        <div class="flex items-center justify-between gap-2">
          <p class="text-sm tracking-tight text-muted-foreground">Diterima</p>
          <p class="text-sm tracking-tight text-foreground font-semibold">
            {{ formatPrice(transaction.cash_received) }}
          </p>
        </div>

        <div class="flex items-center justify-between gap-2 mt-2">
          <p class="text-lg tracking-tight font-semibold text-foreground">
            Kembali
          </p>
          <p class="text-xl tracking-tight text-primary font-bold">
            {{ formatPrice(transaction.cash_change) }}
          </p>
        </div>
      </div>
    </div>
    <button
      @click="$router.back()"
      class="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
    >
      Selesai
    </button>
  </div>
</template>
