<script setup lang="ts">
import { today, getLocalTimeZone } from "@internationalized/date";

const { logout } = useAuth();
definePageMeta({
  layout: "staff",
  hideHeader: true,
  middleware: ["auth"],
  title: "Outlet",
});

const user = useSupabaseUser();
const colorMode = useColorMode();
const { getTransactionSummary } = useTransaction();
const thisDay = today(getLocalTimeZone()).toString();
const outletId = computed(() => user.value?.user_metadata?.outlet_id || "-");

const summaryTransactions = useState<any>("summary_cache", () => null);

const { pending: pendingSummary } = useLazyAsyncData(
  "outlet-page-summary",
  async () => {
    if (!outletId.value || outletId.value === "-") return null;
    const data = await getTransactionSummary({
      date: thisDay,
      outletId: outletId.value,
    });
    summaryTransactions.value = data;
    return data;
  },
);

const fullname = computed(() => user.value?.user_metadata?.fullname || "-");
const outletName = computed(
  () => user.value?.user_metadata?.outlet_name || "-",
);

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const initials = computed(() => {
  return fullname.value
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
});

const { activeOutlet, fetchActiveOutlet, toggleStatusOpen } = useOutlet();

const { pending } = await useAsyncData("active-outlet-init", async () => {
  const outletId = user.value?.user_metadata?.outlet_id;
  if (outletId && !activeOutlet.value) {
    return await fetchActiveOutlet(outletId);
  }
  return activeOutlet.value;
});

const handleToggle = () => {
  if (!activeOutlet.value) return;
  toggleStatusOpen(!activeOutlet.value?.is_open);
};
</script>

<template>
  <div class="pb-10 pt-6">
    <OutletsStaffSkeleton v-if="pending" />
    <div class="space-y-6" v-else>
      <div class="flex items-center justify-between px-1 pt-4">
        <div class="space-y-0.5">
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-primary"
          >
            Sesi Aktif
          </p>
          <h2 class="text-xl font-bold tracking-tight text-foreground">
            {{ fullname }}
          </h2>
          <p
            class="text-[10px] text-muted-foreground flex items-center gap-1.5"
          >
            <span
              class="size-1.5 rounded-full"
              :class="activeOutlet?.is_open ? 'bg-green-500' : 'bg-red-500'"
            ></span>
            {{ activeOutlet?.name || outletName }}
          </p>
        </div>
        <div
          class="size-12 rounded-2xl bg-secondary border-2 border-background flex items-center justify-center font-bold text-lg shadow-sm"
        >
          {{ initials }}
        </div>
      </div>

      <OutletsSummary
        :summary="summaryTransactions"
        :pending="pendingSummary && !summaryTransactions"
      />

      <ClientOnly>
        <div
          @click="handleToggle"
          class="relative cursor-pointer group overflow-hidden rounded-[1.5rem] border p-4 transition-all duration-300 active:scale-[0.98]"
          :class="
            activeOutlet?.is_open
              ? 'bg-green-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
              : 'bg-red-50/50 border-red-200 dark:bg-red-500/5 dark:border-red-500/20'
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl flex items-center justify-center transition-colors"
                :class="
                  activeOutlet?.is_open
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                "
              >
                <Icon
                  :name="
                    activeOutlet?.is_open
                      ? 'lucide:door-open'
                      : 'lucide:door-closed'
                  "
                  class="size-5"
                />
              </div>
              <div>
                <p
                  class="text-[10px] font-bold uppercase opacity-50 tracking-wider"
                >
                  Operasional Toko
                </p>
                <p
                  class="text-sm font-bold"
                  :class="
                    activeOutlet?.is_open ? 'text-emerald-600' : 'text-red-600'
                  "
                >
                  {{
                    activeOutlet?.is_open
                      ? "Toko Sedang Buka"
                      : "Toko Sedang Tutup"
                  }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <div class="h-1 w-8 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full bg-current transition-all duration-500"
                  :class="
                    activeOutlet?.is_open
                      ? 'w-full text-emerald-500'
                      : 'w-1/3 text-red-500'
                  "
                ></div>
              </div>
              <p class="text-[9px] font-bold opacity-40 uppercase">
                Tap to Change
              </p>
            </div>
          </div>
        </div>
        <template #fallback>
          <Skeleton
            class="h-[74px] w-full rounded-[1.5rem] border border-border/50 bg-muted"
          />
        </template>
      </ClientOnly>

      <div class="space-y-2">
        <p
          class="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1"
        >
          Pengaturan
        </p>
        <ClientOnly>
          <div
            class="bg-card border border-border/60 rounded-[1.5rem] divide-y divide-border/40 overflow-hidden shadow-sm"
          >
            <button
              @click="toggleTheme"
              class="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-9 rounded-lg bg-secondary flex items-center justify-center text-foreground border border-border transition-transform group-active:scale-90"
                >
                  <Icon
                    :name="
                      colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun'
                    "
                    class="size-4"
                  />
                </div>
                <span class="text-sm font-medium">Mode Tampilan</span>
              </div>
              <span
                class="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-md"
              >
                {{ colorMode.value }}
              </span>
            </button>

            <button
              @click="logout()"
              class="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-9 rounded-lg bg-destructive/5 flex items-center justify-center text-destructive border border-destructive/10 group-hover:bg-destructive group-hover:text-white transition-all"
                >
                  <Icon name="lucide:log-out" class="size-4" />
                </div>
                <span class="text-sm font-medium text-destructive">Logout</span>
              </div>
              <Icon
                name="lucide:chevron-right"
                class="size-5 text-muted-foreground/30 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          <template #fallback>
            <Skeleton
              class="h-[139px] w-full rounded-[1.5rem] border border-border/50 bg-muted"
            />
          </template>
        </ClientOnly>
      </div>

      <div class="pt-4 text-center">
        <p
          class="text-[9px] font-medium text-muted-foreground/30 uppercase tracking-[0.3em]"
        >
          Tiga Jajan POS &bull; Version 1.0.0
        </p>
      </div>
    </div>
  </div>
</template>
