<script setup lang="ts">
const props = defineProps<{
  data: {
    labels: string[];
    series: { name: string; data: number[] }[];
  } | null;
}>();

const colors = [
  "#ff8fab",
  "#4cc9f0",
  "#4ee081",
  "#ffb703",
  "#7209b7",
  "#4361ee",
  "#f72585",
  "#4895ef",
  "#fb8500",
  "#a2d2ff",
];

const fullDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const chartOption = computed(() => ({
  grid: { top: 20, right: 10, bottom: 20, left: 50 },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(24, 24, 27, 0.9)",
    borderColor: "#3f3f46",
    textStyle: { color: "#fff", fontSize: 12 },
    padding: [12, 16],
    borderRadius: 12,
    formatter: (params: any) => {
      const dayName = fullDay[params[0].dataIndex];
      let res = `<div class="text-xs opacity-50 font-bold mb-1">${dayName}</div>`;
      params.forEach((item: any) => {
        res += `<div class="flex items-center gap-2 mb-1">
                  <span style="background-color:${item.color};" class="size-2 rounded-full"></span>
                  <span class=" text-xs text-white/80">${item.seriesName}:</span>
                  <span class="font-bold ml-auto">${item.value.toLocaleString("id-ID")}</span>
                </div>`;
      });
      return res;
    },
  },
  xAxis: {
    type: "category",
    data: props.data?.labels || [],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#71717a", fontSize: 11, margin: 15 },
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: { color: "#e4e4e7", type: "dashed", opacity: 0.4 },
    },
    axisLabel: {
      color: "#71717a",
      fontSize: 10,
      formatter: (value: number) =>
        value >= 1000000
          ? (value / 1000000).toFixed(1) + "M"
          : value.toLocaleString(),
    },
  },
  series:
    props.data?.series.map((item, index) => ({
      name: item.name,
      data: item.data,
      type: "line",
      smooth: 0.4,
      symbol: "circle",
      symbolSize: 6,
      itemStyle: { color: colors[index % colors.length] },
      lineStyle: { width: 3, color: colors[index % colors.length] },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors[index % colors.length] + "1A" }, // 1A = 10% opacity
            { offset: 1, color: "transparent" },
          ],
        },
      },
    })) || [],
}));
</script>

<template>
  <Card class="px-6">
    <div
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p class="text-base font-semibold text-foreground/90 tracking-tight">
          Revenue Analytics
        </p>
        <p class="text-xs text-muted-foreground">
          Last 7 days performance by outlet
        </p>
      </div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 max-w-[300px] justify-end">
        <div
          v-for="(item, i) in data?.series"
          :key="item.name"
          class="flex items-center gap-1.5"
        >
          <span
            class="size-2 rounded-full"
            :style="{ backgroundColor: colors[i % colors.length] }"
          ></span>
          <span class="text-xs font-medium opacity-60 tracking-tight">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>

    <div class="h-[280px] w-full">
      <VChart :option="chartOption" autoresize />
    </div>
  </Card>
</template>
