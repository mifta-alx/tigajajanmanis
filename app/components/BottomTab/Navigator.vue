<script setup lang="ts">
const props = defineProps<{
  items: Array<{ url: string }>;
}>();

const route = useRoute();
const activeIndex = computed(() => {
  return props.items.findIndex((item) => route.path.startsWith(item.url));
});

// Logika untuk menentukan lebar dan posisi horizontal indikator
const indicatorStyle = computed(() => {
  if (activeIndex.value === -1) return { width: "0%", left: "0%", opacity: 0 };

  const totalTabs = props.items.length;
  const tabWidth = 100 / totalTabs;

  // Tentukan lebar border yang kamu inginkan (misal: 30px atau 20%)
  const borderSize = 60; // dalam pixel (px)

  // Kalkulasi agar posisi border tepat di tengah tab yang aktif
  // Rumus: (lebar_tab * index) + (lebar_tab / 2)
  const centerPosition = tabWidth * activeIndex.value + tabWidth / 2;

  return {
    width: `${borderSize}px`,
    left: `${centerPosition}%`,
    transform: "translateX(-50%)", // Geser ke kiri sebesar setengah lebarnya sendiri agar center
    opacity: 1,
  };
});
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 shadow-lg bg-sidebar p-3 flex items-center justify-center"
  >
    <div
      class="relative flex flex-row items-center justify-around w-full max-w-lg"
    >
      <div
        class="absolute top-[-12px] h-[2px] bg-accent-foreground transition-all duration-300 ease-in-out"
        :style="indicatorStyle"
      />
      <slot />
    </div>
  </nav>
</template>
