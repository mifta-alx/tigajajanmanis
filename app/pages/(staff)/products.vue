<script setup lang="ts">
import type { MerchantProduct } from "~/types/product";
import { formatNumberPrice, formatPrice, getImage } from "~/lib/utils";
import CustomNumberField from "~/components/CustomNumberField.vue";

definePageMeta({
  layout: "staff",
  middleware: ["auth", "outlet-gate"],
  title: "Produk",
  searchPlaceholder: "Cari produk...",
});
const user = useSupabaseUser();
const { fetchProductsByOutlet } = useProduct();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const products = useState<MerchantProduct[]>("products_cache", () => []);

const { pending, refresh } = useLazyAsyncData("products-staff", async () => {
  const data = await fetchProductsByOutlet(outletId.value);
  products.value = data;
  return data;
});

const stockInput = ref<Record<string, number>>({});
const totalItems = computed(() =>
  Object.values(stockInput.value).reduce((a, b) => a + b, 0),
);

const totalPrice = computed(() => {
  return Object.entries(stockInput.value).reduce((acc, [id, qty]) => {
    const product = products.value.find((p) => p.id === id);
    return acc + (product?.selling_price || 0) * qty;
  }, 0);
});

const isReviewOpen = ref(false);

const onTransactionSuccess = () => {
  stockInput.value = {};
  refresh();
};
const currentStep = ref<"review" | "payment">("review");

const openReview = () => {
  currentStep.value = "review";
  isReviewOpen.value = true;
};

const searchQuery = useState("search_query", () => "");

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;

  const query = searchQuery.value.toLowerCase();
  return products.value.filter((p) => {
    return p.name.toLowerCase().includes(query);
  });
});
</script>

<template>
  <div :class="['space-y-6 pt-24', totalItems > 0 ? 'pb-28' : 'pb-8']">
    <StaffPageHeader
      title="Katalog"
      description="Produk"
      :amount="`${filteredProducts?.length} Produk`"
      :is-pending="pending && products.length === 0"
    />
    <SkeletonProductList v-if="pending && products.length === 0" />
    <StaffEmptyState
      v-else-if="!pending && products.length === 0"
      :pending="pending"
      item-name="produk"
      description="Stok produk di outlet ini masih kosong. Silakan tambah stok produk atau muat ulang halaman."
      @refresh="refresh"
    />
    <StaffNotFoundState
      v-else-if="searchQuery && filteredProducts.length === 0"
      item-name="produk"
    />
    <div v-else class="grid grid-cols-1">
      <ProductsItem
        v-for="(product, index) in filteredProducts"
        :key="product.id"
        :product="product"
        v-model="stockInput[product.id]"
        :is-last="index === products.length - 1"
      />
    </div>
    <ProductsFloatingBar
      @click="openReview"
      :show="totalItems > 0"
      :total-items="totalItems"
      :total-price="totalPrice"
    />
    <OrderCheckoutSheet
      v-model="isReviewOpen"
      :stock-input="stockInput"
      :products="products"
      @success="onTransactionSuccess"
    />
  </div>
</template>
