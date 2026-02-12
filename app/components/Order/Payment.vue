<script setup lang="ts">
import { formatNumberPrice, formatPrice } from "~/lib/utils";
const props = defineProps<{
  totalPrice: number;
  modelValue: number;
}>();

const emit = defineEmits(["update:modelValue"]);

const cashValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const changeAmount = computed(() => {
  const change = cashValue.value - props.totalPrice;
  return change > 0 ? change : 0;
});

const formatDisplay = (val: number) => {
  if (!val) return "";
  return new Intl.NumberFormat("id-ID").format(val);
};

const unformatPriceBase = (val: string) => {
  if (!val) return 0;
  const numeric = val.replace(/\D/g, "");
  return parseInt(numeric, 10) || 0;
};
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <div class="text-center space-y-0.5">
      <p class="text-base font-semibold text-muted-foreground tracking-tight">
        Total Tagihan
      </p>
      <h1 class="text-[40px] font-bold tracking-tight leading-none">
        {{ formatPrice(totalPrice) }}
      </h1>
    </div>
    <div class="space-y-4">
      <div
        class="bg-muted/30 border-2 border-border/60 rounded-[1.5rem] overflow-hidden"
      >
        <div class="p-6 pb-4">
          <p
            class="text-base font-semibold text-muted-foreground tracking-tight mb-1"
          >
            Nominal Uang
          </p>
          <div class="relative flex items-center">
            <span class="text-2xl font-bold mr-2 text-muted-foreground"
              >Rp</span
            >
            <input
              type="text"
              inputmode="numeric"
              :value="formatDisplay(cashValue)"
              @input="
                (e: any) => (cashValue = unformatPriceBase(e.target.value))
              "
              placeholder="0"
              class="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div
          class="mx-6 border-t border-border/60 py-4 flex justify-between items-center"
        >
          <p class="text-base font-medium text-muted-foreground tracking-tight">
            Kembalian
          </p>
          <p
            class="text-xl font-bold tracking-tighter transition-colors duration-300"
            :class="
              changeAmount > 0 ? 'text-primary' : 'text-muted-foreground/40'
            "
          >
            {{ formatPrice(changeAmount) }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="val in [2000, 5000, 10000, 20000, 50000, 100000]"
          :key="val"
          @click="cashValue = val"
          class="h-16 rounded-[1rem] border-2 border-border/60 bg-card font-bold text-base tracking-tight active:scale-[0.98] transition-all duration-300 ease-in-out"
        >
          {{ formatNumberPrice(val) }}
        </button>
        <button
          @click="cashValue = totalPrice"
          class="col-span-2 h-16 rounded-[1rem] text-primary-foreground bg-primary font-bold text-base tracking-tight active:scale-[0.98] transition-all duration-300 ease-in-out"
        >
          Uang Pas
        </button>
      </div>
    </div>
  </div>
</template>
