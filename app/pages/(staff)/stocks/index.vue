<script setup lang="ts">
import { getImage } from "~/lib/utils";
import type { SimpleMerchants } from "~/types/merchant";

definePageMeta({
  layout: "staff",
  title: "Stok",
});

const user = useSupabaseUser();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const { fetchSimpleMerchants } = useMerchant();

const merchants = useState<SimpleMerchants[]>("merchants_cache", () => []);

const { pending } = useLazyAsyncData("merchants-staff", async () => {
  const data = await fetchSimpleMerchants(true, outletId.value);
  merchants.value = data;
  return data;
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
        <h2 class="text-xl font-bold tracking-tight">Stok Merchant</h2>
      </div>
      <div
        class="bg-secondary/50 px-3 py-1 rounded-full border border-border/50"
      >
        <p class="text-[10px] font-bold text-muted-foreground uppercase">
          {{ merchants.length }} Brand
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <template v-if="pending && merchants.length === 0">
        <Skeleton
          v-for="i in 6"
          :key="i"
          class="h-56 rounded-[1.5rem] border border-border/50"
        />
      </template>

      <NuxtLink
        v-else
        v-for="merchant in merchants"
        :key="merchant.id"
        :to="`/stocks/${merchant.id}`"
        class="group relative flex flex-col h-56 bg-card rounded-[1.5rem] border border-border overflow-hidden transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-md"
      >
        <div class="relative h-3/5 w-full overflow-hidden bg-muted">
          <ImageWithFallback
            imgClass="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            skeletonClass="w-full h-full rounded-b-none"
            :src="getImage(merchant.name, merchant.image_url)"
            :alt="merchant.name"
          />
          <div
            class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20"
          >
            <p class="text-[9px] font-black text-white uppercase">
              {{ merchant.product_count }} SKU
            </p>
          </div>
        </div>
        <div class="flex-1 p-3.5 flex flex-col justify-between bg-card">
          <h3
            class="text-xs font-bold leading-tight uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2 text-wrap truncate"
          >
            {{ merchant.name }}
          </h3>
          <div class="mt-2 flex items-center justify-between">
            <span
              class="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter"
              >Lihat Stok</span
            >
            <div
              class="size-6 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            >
              <Icon name="lucide:chevron-right" class="size-3" />
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div
      v-if="!pending && merchants.length === 0"
      class="flex flex-col items-center justify-center py-20 text-muted-foreground/40"
    >
      <Icon name="lucide:package-2" class="size-10 mb-2" />
      <p class="text-[10px] font-bold uppercase tracking-widest">
        Belum ada penitip
      </p>
    </div>
  </div>
</template>
