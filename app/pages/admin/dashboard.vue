<script setup lang="ts">
import { formatPrice } from "~/lib/utils";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
  title: "Dashboard",
});

const formattedDate = ref("");
onMounted(() => {
  formattedDate.value = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
});

const { fetchDashboardData } = useDashboard();

const dashboards = useState<any>("dashboard_cache", () => null);

const { pending, refresh } = useLazyAsyncData(
  "dashboard",
  async () => {
    const data = await fetchDashboardData();
    dashboards.value = data;
    return data;
  },
  {
    server: true,
  },
);
console.log(dashboards);
</script>

<template>
  <div class="space-y-4 px-1">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <button
        @click="refresh()"
        class="size-10 rounded-full border bg-card flex items-center justify-center shadow-sm active:scale-90 transition-transform"
      >
        <Icon name="lucide:refresh-cw" class="size-4" />
      </button>
    </div>

    <SkeletonDashboard v-if="pending && !dashboards" />
    <div v-else-if="dashboards" class="space-y-4">
      <div
        class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 text-foreground"
      >
        <DashboardStatCard
          title="Total Revenue"
          :value="formatPrice(dashboards.finance.revenue.value)"
          icon="lucide:wallet"
          :trend="`${dashboards?.finance.revenue.trend > 0 ? '+' : ''}${dashboards?.finance.revenue.trend}%`"
          :trend-up="dashboards?.finance.revenue.trend >= 0"
        />
        <DashboardStatCard
          title="Total Profit"
          :value="formatPrice(dashboards.finance.profit.value)"
          icon="lucide:trending-up"
          :trend="`${dashboards?.finance.profit.trend > 0 ? '+' : ''}${dashboards?.finance.profit.trend}%`"
          :trend-up="dashboards?.finance.profit.trend >= 0"
        />
        <DashboardYearlySalesChart :data="dashboards.yearlySales" />
        <div class="sm:col-span-3 md:col-span-2">
          <DashboardStatisticMonthly :data="dashboards.inventory" />
        </div>
      </div>

      <div class="grid grid-cols-1">
        <DashboardRevenueChart :data="dashboards.revenueOutlet" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <DashboardMonthlyProfitChart :data="dashboards.monthlyProfit" />
        </div>
        <DashboardTopProduct :data="dashboards.topProducts" />
      </div>
    </div>
  </div>
</template>
