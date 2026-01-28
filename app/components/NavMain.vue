<script setup lang="ts">
const route = useRoute();
defineProps<{
  items: {
    title: string
    url?: string
    icon?: string
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const isLinkActive = (url?: string) => {
  if (!url) return false
  return route.path === url || route.path.startsWith(url + '/')
}

const isGroupActive = (subItems?: { url: string }[]) => {
  if (!subItems) return false
  return subItems.some(subItem => route.path === subItem.url || route.path.startsWith(subItem.url + '/'))
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <template v-for="item in items" :key="item.title">
          <Collapsible
              v-if="item.items && item.items.length > 0"
              as-child
              :default-open="item.isActive || isGroupActive(item.items)"
              class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <Icon :name="`lucide:${item.icon}`" v-if="item.icon"/>
                  <span>{{ item.title }}</span>
                  <Icon name="lucide:chevron-right" class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                    <SidebarMenuSubButton as-child :is-active="isLinkActive(subItem.url)">
                      <NuxtLink :to="subItem.url">
                        <span>{{ subItem.title }}</span>
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        <SidebarMenuItem v-else>
          <SidebarMenuButton as-child :tooltip="item.title" :is-active="isLinkActive(item.url)">
            <NuxtLink :href="item.url">
              <Icon :name="`lucide:${item.icon}`" v-if="item.icon"/>
              <span>{{ item.title }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
        </template>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
