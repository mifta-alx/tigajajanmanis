<script setup lang="ts">
// const { logout } = useAuth();
// logout();
const items = [
  {
    title: "Produk",
    url: "/products",
    icon: "cake-slice",
  },
  {
    title: "Pedagang",
    url: "/merchants",
    icon: "store",
  },
  {
    title: "Transaksi",
    url: "/transactions",
    icon: "circle-dollar-sign",
  },
  // {
  //   title: "Transaksi",
  //   url: "/transactions",
  //   icon: "circle-dollar-sign",
  // },
];
</script>
<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 shadow-lg bg-sidebar py-3 px-3"
  >
    <div class="flex flex-row items-center justify-around w-full">
      <template v-for="(item, index) in items" :key="index">
        <NuxtLink
          :to="item.url"
          class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 gap-1.5"
        >
          <Icon :name="`lucide:${item.icon}`" class="size-6" />
          <span class="text-xs">{{ item.title }}</span>
        </NuxtLink>
      </template>
    </div>
  </nav>
</template>
