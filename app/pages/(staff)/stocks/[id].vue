<script setup lang="ts">
import { formatPrice, getImage } from "~/lib/utils";
import type { MerchantProduct } from "~/types/product";
import CustomNumberField from "~/components/CustomNumberField.vue";
const route = useRoute();

definePageMeta({
  layout: "focused",
  title: "Tambah Stok",
});

const user = useSupabaseUser();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");
const { fetchProductByMerchant } = useProduct();
const selectedMerchant = route.params.id as string;
const { addBulkStock } = useStock();
const stockInput = ref<Record<string, number>>({});

const products = useState<MerchantProduct[]>(
  `product_cache_${selectedMerchant}`,
  () => [],
);

const { pending, error } = useLazyAsyncData(
  `products-data-${selectedMerchant}`,
  () => fetchProductByMerchant(selectedMerchant, outletId.value),
  {
    transform: (data) => {
      products.value = data;
      data.forEach((p) => {
        if (stockInput.value[p.id] === undefined) {
          stockInput.value[p.id] = 0;
        }
      });
      return data;
    },
    default: () => products.value,
  },
);

const isSubmitting = ref(false);

const handleSave = async () => {
  const itemsToSubmit = Object.entries(stockInput.value)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const p = products.value.find((prod) => prod.id === productId);

      return {
        product_id: productId,
        quantity: qty,
        merchant_id: selectedMerchant,
        // type: "in", // Karena ini "Tambah Stok", tipenya biasanya 'in'
      };
    });
  //

  console.log(itemsToSubmit);
  // if (itemsToSubmit.length === 0)
  //   return alert("Isi jumlah stok terlebih dahulu");
  //
  // isSubmitting.value = true;
  // try {
  //   await addBulkStock(itemsToSubmit);
  //
  //   // Reset input setelah berhasil
  //   stockInput.value = {};
  //   alert("Stok berhasil ditambahkan!");
  //
  //   // Opsional: Kembali ke halaman sebelumnya
  //   useRouter().back();
  // } catch (err) {
  //   console.error("Gagal tambah stok:", err);
  //   alert("Terjadi kesalahan saat menyimpan.");
  // } finally {
  //   isSubmitting.value = false;
  // }
};
</script>

<template>
  <div class="space-y-6 pb-32">
    <div class="px-1 pt-2 flex items-end justify-between">
      <div class="space-y-0.5">
        <p
          class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
        >
          Update Stok
        </p>
        <h2 class="text-xl font-bold tracking-tight">Katalog Produk</h2>
      </div>
      <div
        class="bg-secondary/50 px-3 py-1 rounded-full border border-border/50"
      >
        <p class="text-[10px] font-bold text-muted-foreground uppercase">
          {{ products.length }} SKU
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <template v-if="pending && products.length === 0">
        <div
          v-for="i in 5"
          :key="i"
          class="h-24 rounded-[1.5rem] bg-muted animate-pulse"
        ></div>
      </template>

      <div
        v-for="(p, index) in products"
        :key="p.id"
        class="group flex items-center gap-3.5 p-2 bg-card rounded-[2rem] border border-border/50 shadow-sm transition-all duration-300"
      >
        <div
          class="relative size-24 shrink-0 overflow-hidden rounded-[1.5rem] bg-muted"
        >
          <ImageWithFallback
            :src="getImage(p.name, p.image_url)"
            :alt="p.name"
            imgClass="size-full object-cover group-hover:scale-110 transition-transform duration-500"
            skeletonClass="size-full"
          />
          <div
            class="absolute bottom-2 right-2 bg-background/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-border/50"
          >
            <p class="text-[9px] font-black uppercase tracking-tighter">
              {{ p.current_stock }} <span class="opacity-50">Sisa</span>
            </p>
          </div>
        </div>

        <div class="flex-1 min-w-0 flex flex-col justify-between h-full py-1.5">
          <div>
            <h3
              class="text-base font-semibold leading-tight tracking-tight text-foreground line-clamp-2"
            >
              {{ p.name }}
            </h3>
          </div>

          <div class="flex items-end justify-between">
            <p class="text-sm font-semibold text-primary/80">
              {{ formatPrice(p.selling_price) }}
            </p>

            <div class="origin-right -mb-1">
              <CustomNumberField v-model="stockInput[p.id]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
      <div
        class="max-w-md mx-auto pointer-events-auto flex flex-col items-center"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-y-2 opacity-0 scale-95"
          enter-to-class="transform translate-y-0 opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100 scale-100"
          leave-to-class="transform translate-y-2 opacity-0 scale-95"
        >
          <div
            v-if="Object.values(stockInput).some((v) => v > 0)"
            class="mb-3 w-full"
          >
            <div
              class="bg-accent-foreground/90 backdrop-blur-md text-background px-4 py-2.5 rounded-[1.2rem] shadow-2xl border border-white/10 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="flex flex-col">
                  <span
                    class="text-[8px] font-medium uppercase text-muted/50 tracking-widest leading-none mb-1"
                    >Total Produk</span
                  >
                  <span
                    class="text-[11px] font-bold uppercase tracking-tight leading-none"
                  >
                    {{ Object.values(stockInput).filter((v) => v > 0).length }}
                    Produk
                  </span>
                </div>

                <div class="h-6 w-px bg-white/20"></div>

                <div class="flex flex-col">
                  <span
                    class="text-[8px] font-medium uppercase text-muted/50 tracking-widest leading-none mb-1"
                    >Total Stok</span
                  >
                  <span
                    class="text-[11px] font-bold uppercase tracking-tight leading-none"
                  >
                    {{ Object.values(stockInput).reduce((a, b) => a + b, 0) }}
                    Pcs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <button
          @click="handleSave"
          :disabled="
            isSubmitting || !Object.values(stockInput).some((v) => v > 0)
          "
          class="group relative w-full h-12 rounded-xl bg-foreground text-background transition-all active:scale-[0.97] disabled:opacity-20 disabled:grayscale overflow-hidden shadow-xl"
        >
          <div class="relative z-10 flex items-center justify-center gap-3">
            <Spinner v-if="isSubmitting" class="size-4 text-background" />
            <span v-else class="text-sm font-semibold"> Konfirmasi </span>
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>
