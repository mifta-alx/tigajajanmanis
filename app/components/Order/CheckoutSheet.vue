<script setup lang="ts">
import { DrawerPayment } from "#components";
import { ChevronLeft } from "lucide-vue-next";

const props = defineProps<{
  modelValue: boolean;
  stockInput: Record<string, number>;
  products: any[];
}>();

const emit = defineEmits(["update:modelValue", "success"]);

const { createTransaction, isSubmitting } = useTransaction();
const currentStep = ref<"review" | "payment">("review");
const cashAmount = ref(0);
const transactionResult = ref<any>(null);
const { open, close: closeDrawer } = useDrawer();
const paymentMethod = ref("CASH");

const getProduct = (id: string) => props.products.find((p) => p.id === id);

const totalPrice = computed(() => {
  return Object.entries(props.stockInput).reduce((acc, [id, qty]) => {
    const product = getProduct(id);
    return acc + (product?.selling_price || 0) * qty;
  }, 0);
});

const close = () => {
  if (isSubmitting.value) return;
  emit("update:modelValue", false);
};

const handleGoToPayment = () => {
  if (paymentMethod.value === "CASH") {
    currentStep.value = "payment";
  } else {
    handleConfirmPayment();
  }
};

const handleConfirmPayment = async () => {
  try {
    const result = await createTransaction({
      cashReceived: cashAmount.value,
      stockInput: props.stockInput,
      paymentType: paymentMethod.value,
    });

    transactionResult.value = result;
    open({
      type: "success",
      title: "Pembayaran Berhasil",
      description: "Transaksi tercatat. Stok produk telah diperbarui",
      component: DrawerPayment,
      outsideClick: false,
      props: {
        onDone: () => {
          closeDrawer();
          close();
        },
        amount: totalPrice.value,
      },
    });
    emit("success");
  } catch (err: any) {
    open({
      type: "error",
      title: "Pembayaran Gagal",
      description: "Terjadi kesalahan sistem saat melakukan pembayaran",
      component: DrawerPayment,
      props: {
        isError: true,
        onDone: () => closeDrawer(),
        onRetry: async () => {
          closeDrawer();
          await new Promise((r) => setTimeout(r, 300));
          await handleConfirmPayment();
        },
      },
    });
  }
};

const totalItems = computed(() =>
  Object.values(props.stockInput).reduce((a, b) => a + b, 0),
);

watch(totalItems, (newTotal) => {
  if (props.modelValue && currentStep.value === "review" && newTotal === 0) {
    close();
  }
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = "review";
      cashAmount.value = 0;
      paymentMethod.value = "CASH";
      transactionResult.value = null;
    }
  },
);

const toggleBodyScroll = (isDisabled: boolean) => {
  if (process.client) {
    const action = isDisabled ? "hidden" : "";
    document.documentElement.style.overflow = action;
    document.body.style.overflow = action;

    document.body.style.position = isDisabled ? "fixed" : "";
    document.body.style.width = isDisabled ? "100%" : "";
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    toggleBodyScroll(isOpen);
  },
  { immediate: true },
);

onUnmounted(() => {
  toggleBodyScroll(false);
});
</script>

<template>
  <div class="fixed inset-0 z-50 pointer-events-none">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform translate-x-full"
    >
      <div
        v-if="modelValue"
        class="pointer-events-auto absolute inset-0 bg-background flex flex-col"
      >
        <div
          class="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none bg-background"
        >
          <div
            class="max-w-md mx-auto flex items-center justify-start pointer-events-auto gap-2"
          >
            <button
              @click="
                currentStep === 'review' ? close() : (currentStep = 'review')
              "
              class="flex items-center justify-center transition-all active:scale-90"
            >
              <ChevronLeft class="size-6 text-primary" />
            </button>
            <p
              class="text-foreground text-lg font-semibold tracking-tight line-clamp-1"
            >
              {{
                currentStep === "review"
                  ? "Konfirmasi Pesanan"
                  : currentStep === "payment"
                    ? "Pembayaran"
                    : ""
              }}
            </p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 pt-20">
          <template v-if="currentStep === 'review'">
            <OrderReview
              v-model="paymentMethod"
              :stock-input="stockInput"
              :get-product="getProduct"
              :total-items="totalItems"
              :total-price="totalPrice"
            />
          </template>

          <template v-else-if="currentStep === 'payment'">
            <OrderPayment :total-price="totalPrice" v-model="cashAmount" />
          </template>
        </div>
        <div
          class="relative z-10 w-full bg-background px-6 pb-6 pt-4 shadow-2xl border-t border-border/50"
        >
          <button
            @click="
              currentStep === 'review'
                ? handleGoToPayment()
                : handleConfirmPayment()
            "
            :disabled="
              (currentStep === 'payment' && cashAmount < totalPrice) ||
              isSubmitting
            "
            class="group relative w-full h-11 rounded-full bg-primary text-primary-foreground transition-all active:scale-[0.97] disabled:grayscale disabled:opacity-50 overflow-hidden"
          >
            <div class="relative z-10 flex items-center justify-center gap-3">
              <Spinner v-if="isSubmitting" />
              <span class="text-sm font-semibold"
                >{{
                  currentStep === "review"
                    ? "Lanjutkan"
                    : currentStep === "payment"
                      ? "Konfirmasi"
                      : "Selesai"
                }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
