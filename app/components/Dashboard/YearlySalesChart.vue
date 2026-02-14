<script setup lang="ts">
const props = defineProps<{
  data: {
    labels: string[];
    series: number[];
    trend: number;
    currentYear: number;
    lastYear: number;
  } | null;
}>();

const chartOption = computed(() => ({
  grid: {
    top: 0,
    right: 0,
    bottom: 5,
    left: 0,
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(24, 24, 27, 0.9)",
    borderColor: "#3f3f46",
    textStyle: { color: "#fff", fontSize: 11 },
    padding: [8, 12],
    borderRadius: 10,
    formatter: (params: any) => {
      const fullMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = fullMonths[params[0].dataIndex];
      return `
        <div class="text-xs opacity-50 font-bold mb-1">${monthName}</div>
        <div class="font-black text-emerald-400 text-xs">${params[0].value} transactions</div>
      `;
    },
  },
  xAxis: {
    type: "category",
    data: props.data?.labels || [],
    show: false,
  },
  yAxis: {
    type: "value",
    show: false,
  },
  series: [
    {
      name: "Sales Volume",
      type: "line",
      data: props.data?.series || [],
      smooth: 0.5,
      showSymbol: false,
      lineStyle: {
        width: 4,
        color: "#10b981",
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(16, 185, 129, 0.25)" },
            { offset: 1, color: "transparent" },
          ],
        },
      },
    },
  ],
}));
</script>

<template>
  <Card class="px-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-base font-semibold text-foreground/90 tracking-tight">
          Sales
        </p>
        <p class="text-xs text-muted-foreground">Last Year</p>
      </div>
      <div v-if="data" class="text-right">
        <p
          :class="[
            'text-sm font-bold',
            data.trend >= 0 ? 'text-emerald-500' : 'text-red-500',
          ]"
        >
          {{ data.trend >= 0 ? "+" : "" }}{{ data.trend }}%
        </p>
      </div>
    </div>

    <div class="h-[100px] w-full">
      <VChart :option="chartOption" autoresize />
    </div>
  </Card>
</template>
