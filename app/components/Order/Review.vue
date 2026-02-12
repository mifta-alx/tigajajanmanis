<script setup lang="ts">
import { formatPrice, getImage } from "~/lib/utils";

const props = defineProps<{
  stockInput: Record<string, number>;
  getProduct: (id: string) => any;
  totalPrice: number;
  totalItems: number;
  modelValue: string;
}>();

const emit = defineEmits(["close", "update:modelValue"]);

const internalPaymentMethod = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="space-y-6">
    <div
      class="bg-card border border-border/80 rounded-[1.5rem] divide-y divide-border/40 overflow-hidden flex flex-col"
    >
      <div class="p-4 flex flex-col">
        <template v-for="(qty, id) in stockInput" :key="id">
          <div
            v-if="qty > 0"
            class="flex flex-col items-end gap-2 py-4 first:pt-0 last:pb-0 border-b border-border last:border-0"
          >
            <div class="w-full flex flex-row items-start gap-8">
              <div
                class="flex-1 min-w-0 flex flex-col justify-start h-full py-1 gap-2"
              >
                <h3
                  class="text-base font-semibold leading-tight tracking-tight text-foreground line-clamp-2"
                >
                  {{ getProduct(id)?.name }}
                </h3>

                <p
                  class="text-sm text-foreground/60 tracking-tight font-normal -mt-1"
                >
                  {{ getProduct(id)?.merchant_name }}
                </p>
                <p
                  class="text-base font-semibold text-foreground tracking-tight"
                >
                  {{ formatPrice(getProduct(id)?.selling_price) }}
                </p>
              </div>
              <div class="gap-2 flex flex-col items-end">
                <div
                  class="size-20 rounded-[1rem] overflow-hidden shrink-0 bg-muted"
                >
                  <ImageWithFallback
                    :src="
                      getImage(getProduct(id)?.name, getProduct(id)?.image_url)
                    "
                    :alt="getProduct(id)?.name"
                    imgClass="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                    skeletonClass="size-full"
                  />
                </div>
                <OrderNumberInput v-model="stockInput[id]" />
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="flex gap-6 flex-row justify-between items-center p-4">
        <div>
          <h3
            class="text-base font-semibold leading-tight tracking-tight text-foreground line-clamp-2"
          >
            Ada lagi yang mau dibeli?
          </h3>
          <p class="text-sm font-light text-foreground tracking-tight">
            Masih bisa nambah menu lain, ya.
          </p>
        </div>
        <button
          @click="emit('close')"
          class="flex items-center justify-center transition-all duration-300 ease-in-out rounded-full h-9 w-20 p-1 bg-primary text-primary-foreground active:scale-[0.98]"
        >
          <span class="text-xs font-bold tracking-tight">Tambah</span>
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-base font-semibold text-foreground tracking-tight px-1">
        Metode pembayaran
      </p>
      <div
        class="bg-card border border-border/80 rounded-[1.5rem] overflow-hidden flex flex-col p-4"
      >
        <RadioGroup
          v-model="internalPaymentMethod"
          class="divide-y divide-border/80 gap-0"
        >
          <label
            for="cash"
            class="flex items-center justify-between pb-4 cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div
                class="size-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                :class="
                  internalPaymentMethod === 'CASH'
                    ? 'bg-primary shadow-lg shadow-primary/20'
                    : 'bg-primary/10'
                "
              >
                <Icon
                  name="lucide:banknote"
                  class="size-6 transition-colors"
                  :class="
                    internalPaymentMethod === 'CASH'
                      ? 'text-background'
                      : 'text-primary'
                  "
                />
              </div>
              <div>
                <p
                  class="text-sm font-bold tracking-tight uppercase transition-colors"
                  :class="
                    internalPaymentMethod === 'CASH'
                      ? 'text-primary'
                      : 'text-foreground'
                  "
                >
                  Tunai
                </p>
                <p
                  class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest"
                >
                  Bayar Langsung
                </p>
              </div>
            </div>
            <RadioGroupItem value="CASH" id="cash" class="size-5" />
          </label>

          <label
            for="qris"
            class="flex items-center justify-between pt-4 cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div
                class="size-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                :class="
                  internalPaymentMethod === 'QRIS'
                    ? 'bg-primary shadow-lg shadow-primary/20'
                    : 'bg-primary/10'
                "
              >
                <Icon
                  name="lucide:qr-code"
                  class="size-6 transition-colors"
                  :class="
                    internalPaymentMethod === 'QRIS'
                      ? 'text-background'
                      : 'text-primary'
                  "
                />
              </div>
              <div>
                <p
                  class="text-sm font-bold tracking-tight uppercase transition-colors"
                  :class="
                    internalPaymentMethod === 'QRIS'
                      ? 'text-primary'
                      : 'text-foreground'
                  "
                >
                  QRIS Statis
                </p>
                <p
                  class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest"
                >
                  Scan Barcode
                </p>
              </div>
            </div>
            <RadioGroupItem value="QRIS" id="qris" class="size-5" />
          </label>
        </RadioGroup>
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-base font-semibold text-foreground tracking-tight px-1">
        Ringkasan pembayaran
      </p>
      <div
        class="bg-card border border-border/80 rounded-[1.5rem] overflow-hidden flex flex-col"
      >
        <div class="px-4 pt-4">
          <div class="space-y-2 border-b border-border pb-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-normal text-foreground/70 tracking-tight">
                Subtotal ({{ totalItems }} produk)
              </p>
              <p class="text-sm font-normal text-foreground tracking-tight">
                {{ formatPrice(totalPrice) }}
              </p>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-sm font-normal text-foreground/70 tracking-tight">
                Pajak (0%)
              </p>
              <p class="text-sm font-normal text-foreground tracking-tight">
                {{ formatPrice(0) }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-row items-center justify-between p-4">
          <p
            class="text-base font-bold text-foreground tracking-tight leading-none"
          >
            Total pembayaran
          </p>
          <p
            class="text-lg font-bold text-foreground tracking-tight leading-none"
          >
            {{ formatPrice(totalPrice) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
