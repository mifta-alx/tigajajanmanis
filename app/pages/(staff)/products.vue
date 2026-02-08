<script setup lang="ts">
import type { MerchantProduct } from "~/types/product";
import { formatNumberPrice, formatPrice, getImage } from "~/lib/utils";
import CustomNumberField from "~/components/CustomNumberField.vue";

definePageMeta({
  layout: "staff",
  middleware: ["auth", "outlet-gate"],
  title: "Produk",
});
const user = useSupabaseUser();
const { fetchProductsByOutlet } = useProduct();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const products = useState<MerchantProduct[]>("products_cache", () => []);

const { pending } = useLazyAsyncData("products-staff", async () => {
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
</script>

<template>
  <div class="space-y-6">
    <div class="px-1 pt-2 flex items-end justify-between">
      <div class="space-y-0.5">
        <p
          class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
        >
          Katalog
        </p>
        <h2 class="text-xl font-bold tracking-tight">Produk</h2>
      </div>
      <div
        class="bg-secondary/50 px-3 py-1 rounded-full border border-border/50"
      >
        <p class="text-[10px] font-bold text-muted-foreground uppercase">
          {{ products?.length }} Produk
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <ProductsStaffSkeleton v-if="pending && products.length === 0" />
      <div
        v-for="(p, index) in products"
        :key="p.id"
        class="group relative flex items-start gap-10 pb-8 pt-4 first:pt-0"
      >
        <div
          class="absolute -left-6 top-0 bottom-0 bg-primary transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          :class="[(stockInput?.[p.id] ?? 0) > 0 ? 'w-[5px]' : 'w-0']"
        />
        <div
          v-if="index !== products.length - 1"
          class="absolute bottom-0 right-0 h-px last:h-0 border-b border-border transition-all duration-300"
          :class="[(stockInput?.[p.id] ?? 0) > 0 ? 'left-[-18px]' : 'left-0']"
        />
        <div
          class="flex-1 min-w-0 flex flex-col justify-start h-full py-1 gap-2"
        >
          <h3
            class="text-base font-medium leading-tight tracking-tight text-foreground line-clamp-2"
          >
            {{ p.name }}
          </h3>

          <p class="text-xs text-primary/60 tracking-tight font-normal -mt-1">
            {{ p.merchant_name }}
          </p>
          <div class="mt-3 gap-2 flex flex-row items-center">
            <p class="text-base font-semibold text-foreground tracking-tight">
              {{ formatPrice(p.selling_price) }}
            </p>
            <Badge variant="secondary"> {{ p.current_stock }} Tersisa </Badge>
          </div>
        </div>

        <div class="relative">
          <div class="size-32 rounded-[1rem] overflow-hidden shrink-0 bg-muted">
            <ImageWithFallback
              :src="getImage(p.name, p.image_url)"
              :alt="p.name"
              imgClass="size-full object-cover group-hover:scale-110 transition-transform duration-500"
              skeletonClass="size-full"
            />
          </div>
          <div
            class="absolute -bottom-4 right-0 left-0 flex justify-center items-center"
          >
            <ProductsNumberInput v-model="stockInput[p.id]" />
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-12 left-0 right-0 p-6 z-40 pointer-events-none">
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
          <div v-if="totalItems > 0" class="mb-3 w-full">
            <button
              class="w-full active:scale-[0.98] duration-300 transition-all ease-in-out bg-accent-foreground backdrop-blur-md text-background px-5 py-2.5 rounded-full shadow-2xl border border-white/10 flex items-center justify-between"
            >
              <div class="flex items-center justify-between gap-3 flex-1">
                <div class="flex flex-col items-start">
                  <span
                    class="text-xs font-bold tracking-tight leading-none mb-1"
                  >
                    {{ totalItems }}
                    item{{ totalItems > 1 ? "s" : "" }}
                  </span>
                  <span
                    class="text-[10px] font-normal tracking-tight text-muted/50 leading-none"
                    >Total Produk</span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold tracking-tight leading-none">
                    {{ formatNumberPrice(totalPrice) }}
                  </span>
                  <Icon name="lucide:shopping-basket" class="size-6" />
                </div>
              </div>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
