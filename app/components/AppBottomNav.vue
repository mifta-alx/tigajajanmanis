<script setup lang="ts">
const items = [
  {
    title: "Produk",
    url: "/products",
    icon: "cake-slice",
  },
  {
    title: "Stok",
    url: "/stocks",
    icon: "package-2",
  },
  {
    title: "Transaksi",
    url: "/transactions",
    icon: "circle-dollar-sign",
  },
  {
    title: "Outlet",
    url: "/outlet",
    icon: "store",
  },
];
</script>

<template>
  <BottomTabNavigator :items="items">
    <BottomTabItem
      v-for="(item, index) in items"
      :key="index"
      :icon="item.icon"
      :href="item.url"
    >
      {{ item.title }}
    </BottomTabItem>
  </BottomTabNavigator>
</template>
