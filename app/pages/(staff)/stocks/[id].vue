<script setup lang="ts">
import { formatPrice, getImage } from "~/lib/utils";
import type { MerchantProduct } from "~/types/product";
import CustomNumberField from "~/components/CustomNumberField.vue";
const route = useRoute();

definePageMeta({
  layout: "focused",
  title: "Tambah Stok",
});

useSeoMeta({
  title: "TigaJajan POS | Stocks",
  ogTitle: "TigaJajan POS | Stocks",
  description: "",
  ogDescription: "",
});

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
  () => fetchProductByMerchant(selectedMerchant),
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
  <div class="pb-28">
    <div class="flex flex-col gap-4">
      <div
        v-for="i in 10"
        :key="i"
        class="flex items-center justify-between gap-2"
        role="status"
        aria-busy="true"
      >
        <div class="flex items-start gap-2.5">
          <Skeleton class="size-20 rounded-lg" />
          <div class="space-y-1.5 mt-1">
            <Skeleton class="h-6 w-16 rounded-sm" />
            <Skeleton class="h-2 w-28 rounded-sm" />
            <Skeleton class="h-5 w-20 mt-4 rounded-sm" />
          </div>
        </div>
        <Skeleton class="h-8 w-8 rounded-full" />
      </div>
      <div
        v-for="(p, index) in products"
        :key="p.id"
        class="flex items-center justify-between gap-2"
      >
        <div class="flex items-start gap-2.5">
          <ImageWithFallback
            :src="getImage(p.name, p.image_url)"
            :alt="p.name"
            class="size-20 rounded-lg"
            imgClass="size-20 rounded-lg object-cover"
            skeletonClass="size-20 rounded-lg"
          />
          <div>
            <p class="text-base font-semibold leading-tight">{{ p.name }}</p>
            <p class="text-xs text-muted-foreground">
              Stok saat ini : {{ p.stock }}
            </p>
            <p class="text-base mt-1 font-medium">
              {{ formatPrice(p.selling_price) }}
            </p>
          </div>
        </div>
        <CustomNumberField v-model="stockInput[p.id]" />
      </div>
    </div>
    <div
      class="fixed bottom-0 left-0 right-0 p-4 bg-background flex flex-col gap-2 z-20 border-t-0"
    >
      <div
        v-if="Object.values(stockInput).some((v) => v > 0)"
        class="text-center text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-1"
      >
        {{ Object.values(stockInput).filter((v) => v > 0).length }} Produk akan
        diperbarui
      </div>
      <button
        @click="handleSave"
        :disabled="
          isSubmitting || !Object.values(stockInput).some((v) => v > 0)
        "
        class="w-full bg-sidebar-accent-foreground text-sidebar py-3 rounded-full font-semibold active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Spinner v-if="isSubmitting" />
        {{ isSubmitting ? "Memproses..." : "Konfirmasi" }}
      </button>
    </div>
  </div>
</template>
