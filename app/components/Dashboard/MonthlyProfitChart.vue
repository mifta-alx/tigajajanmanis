<script setup lang="ts">
import type { MonthlyData } from "~/types/dashboard";

const date = new Date();
const year = date.getFullYear();

const props = defineProps<{
  data: MonthlyData[] | null;
}>();

const chartOption = computed(() => {
  const seriesData = props.data ? props.data.map((p) => p.profit) : [];
  const xAxisData = props.data
    ? props.data.map((p) => p.month)
    : [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
  return {
    grid: {
      top: 20,
      right: 10,
      bottom: 40,
      left: 40,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(24, 24, 27, 0.9)",
      borderColor: "#3f3f46",
      textStyle: { color: "#fff", fontSize: 12 },
      padding: [12, 16],
      borderRadius: 12,
      axisPointer: {
        type: "shadow",
        shadowStyle: { color: "rgba(255, 143, 171, 0.05)" },
      },
      formatter: (params: any) => {
        const data = params[0];
        const monthNames: Record<string, string> = {
          Jan: "January",
          Feb: "February",
          Mar: "March",
          Apr: "April",
          May: "May",
          Jun: "June",
          Jul: "July",
          Aug: "August",
          Sep: "September",
          Oct: "October",
          Nov: "November",
          Dec: "December",
        };

        const fullMonthName = monthNames[data.name] || data.name;
        return `
        <div class="text-xs font-bold mb-1 opacity-50">${fullMonthName}</div>
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full bg-primary"></span>
          <span class="font-semibold text-primary">Rp ${data.value.toLocaleString()}</span>
        </div>
      `;
      },
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#a1a1aa",
        fontSize: 12,
        margin: 20,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: { color: "#e4e4e7", type: "dashed", opacity: 0.2 },
      },
      axisLabel: {
        color: "#a1a1aa",
        fontSize: 10,
        formatter: (value: number) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
          if (value >= 1000) return (value / 1000).toFixed(0) + "K";
          return value;
        },
      },
    },
    series: [
      {
        name: "Profit",
        type: "bar",
        data: seriesData,
        barWidth: "70%",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#ffb3c6" },
              { offset: 1, color: "#ff8fab" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: "#ff8fab",
          },
        },
      },
    ],
  };
});
</script>

<template>
  <Card class="px-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-base font-semibold text-foreground/90 tracking-tight">
          Monthly Profit
        </p>
        <p class="text-xs text-muted-foreground">
          Estimated Net Profit (Aggregate)
        </p>
      </div>
      <div
        class="rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase"
      >
        {{ year }}
      </div>
    </div>

    <div class="h-[300px] w-full">
      <VChart :option="chartOption" autoresize />
    </div>
  </Card>
</template>
