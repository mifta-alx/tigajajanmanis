<script setup lang="ts">
import { getImage } from "~/lib/utils";
import type { SimpleMerchants } from "~/types/merchant";

definePageMeta({
  layout: "staff",
  title: "Stok",
});

useSeoMeta({
  title: "TigaJajan POS | Stok",
  ogTitle: "TigaJajan POS | Stok",
  description: "",
  ogDescription: "",
});

const { fetchSimpleMerchants } = useMerchant();
const merchants = useState<SimpleMerchants[]>("merchants_cache", () => []);
const { pending } = useLazyAsyncData("merchants-staff", async () => {
  const data = await fetchSimpleMerchants(true);
  merchants.value = data;
  return data;
});
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <Skeleton
      v-if="pending && merchants.length === 0"
      v-for="i in 10"
      class="h-52 rounded-lg"
      :key="i"
    />
    <NuxtLink
      v-else-if="merchants && merchants.length > 0"
      v-for="merchant in merchants"
      :key="merchant.id"
      :to="`/stocks/${merchant.id}`"
      class="rounded-2xl h-52 flex relative"
    >
      <ImageWithFallback
        imgClass="w-full h-full object-cover rounded-2xl"
        skeletonClass="w-full h-full rounded-2xl"
        :src="getImage(merchant.name, merchant.image_url)"
        :alt="merchant.name"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 rounded-2xl"
      >
        <h3
          class="text-white font-medium text-base leading-tight tracking-tight"
        >
          {{ merchant.name }}
        </h3>

        <p class="text-gray-300 text-xs mt-2 flex items-center gap-1">
          <span class="bg-white/20 px-2 py-0.5 rounded-full">
            {{ merchant.product_count }} Produk
          </span>
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped></style>
