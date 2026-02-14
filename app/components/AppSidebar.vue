<script setup lang="ts">
import NavFooter from "~/components/NavFooter.vue";

const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: "chart-pie",
  },
  {
    title: "Outlets",
    url: "/admin/outlets",
    icon: "store",
  },
  {
    title: "Inventory",
    icon: "package-2",
    items: [
      {
        title: "Merchants",
        url: "/admin/inventory/merchants",
      },
      {
        title: "Products",
        url: "/admin/inventory/products",
      },
    ],
  },
  {
    title: "Workflows",
    icon: "calculator",
    items: [
      {
        title: "Stock In",
        url: "/admin/workflows/stock-in",
      },
      {
        title: "Settlement",
        url: "/admin/workflows/settlement",
      },
    ],
  },
  {
    title: "Sales",
    url: "/admin/sales",
    icon: "circle-dollar-sign",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: "user-round",
  },
];
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            class="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent hover:text-foreground"
          >
            <a href="/">
              <Icon name="lucide:cookie" class="!size-5" />
              <span class="text-base font-semibold">TigaJajan.</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="items" />
    </SidebarContent>
    <SidebarFooter>
      <NavFooter />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
