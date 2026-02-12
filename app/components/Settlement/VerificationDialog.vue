<script setup lang="ts">
import { FileCheck2 } from "lucide-vue-next";
import type { SettlementProduct } from "~/types/stock";
const props = defineProps<{
  open: boolean;
  selectedProducts: SettlementProduct[];
  isSubmitting: boolean;
}>();

const emit = defineEmits(["update:open", "confirm"]);

const totalItems = computed(() => props.selectedProducts.length);
const totalStock = computed(() =>
  props.selectedProducts.reduce(
    (acc, curr) => acc + (curr.current_stock || 0),
    0,
  ),
);

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="sm:max-w-md rounded-[2rem] p-0 border-none overflow-hidden shadow-2xl bg-card"
      @interact-outside="(event) => event.preventDefault()"
      :show-close-button="false"
    >
      <DialogTitle class="hidden">Verifikasi Retur</DialogTitle>
      <DialogDescription class="hidden"> Verifikasi Retur </DialogDescription>
      <div class="p-8 pb-4 text-center">
        <div
          class="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 rotate-6"
        >
          <FileCheck2 class="size-6" />
        </div>
        <h2
          class="text-xl font-bold uppercase tracking-tighter text-foreground"
        >
          Verifikasi Retur
        </h2>
        <p
          class="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1"
        >
          Tujuan: {{ selectedProducts[0]?.merchant_name }}
        </p>
      </div>

      <div class="px-6 space-y-2">
        <div
          class="bg-background rounded-[1.5rem] border border-border/50 p-5 space-y-4"
        >
          <div class="space-y-3">
            <div
              v-for="p in selectedProducts"
              :key="p.product_id"
              class="flex justify-between items-center text-xs"
            >
              <span
                class="font-medium text-muted-foreground truncate max-w-[180px]"
                >{{ p.product_name }}</span
              >
              <span class="font-bold tracking-tight text-foreground"
                >{{ p.current_stock }} Pcs</span
              >
            </div>
          </div>

          <div class="h-px w-full border-t border-dashed border-border"></div>

          <div class="flex justify-between items-end pt-2">
            <div>
              <p
                class="mb-1 text-[10px] font-bold uppercase text-muted-foreground tracking-widest"
              >
                Total Sisa Barang
              </p>
              <p class="text-xs font-semibold text-muted-foreground opacity-80">
                {{ totalItems }} Produk Terpilih
              </p>
            </div>
            <p class="text-3xl font-black tracking-tighter text-foreground">
              {{ totalStock }}
              <span class="text-sm font-bold opacity-40">Pcs</span>
            </p>
          </div>
        </div>

        <div
          class="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <Icon name="lucide:info" class="size-4 bg-amber-500 shrink-0" />
          <p class="text-[11px] leading-tight text-amber-500/80 font-medium">
            Data ini akan mengunci stok sesi sebelumnya dan membuka sesi baru
            untuk merchant ini.
          </p>
        </div>
      </div>

      <div class="p-6 pt-4 space-y-3">
        <button
          @click="emit('confirm')"
          :disabled="isSubmitting"
          class="w-full h-11 bg-primary text-primary-foreground rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Spinner v-if="isSubmitting" class="size-4" />
          <span v-else>Ya, proses pengembalian</span>
        </button>

        <button
          @click="isOpen = false"
          class="w-full py-2 bg-card text-muted-foreground font-medium text-sm hover:bg-secondary transition-all"
        >
          Periksa kembali
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
