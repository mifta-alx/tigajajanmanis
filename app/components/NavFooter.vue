<script setup lang="ts">
import { useSidebar } from "~/components/ui/sidebar";
import type { Role } from "~/types/role";
const { logout } = useAuth();
const user = useSupabaseUser();
const { isMobile } = useSidebar();
const role = user.value?.app_metadata?.role as Role | undefined;
const username = user?.value?.user_metadata?.username as string;
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <!--            <Avatar class="h-8 w-8 rounded-lg grayscale">-->
            <!--              <AvatarImage :src="user.avatar" :alt="user.name" />-->
            <!--              <AvatarFallback class="rounded-lg">-->
            <!--                CN-->
            <!--              </AvatarFallback>-->
            <!--            </Avatar>-->
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ username }}</span>
              <span class="text-muted-foreground truncate text-xs">
                {{ role }}
              </span>
            </div>
            <Icon name="lucide:ellipsis-vertical" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
          align="end"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <!--              <Avatar class="h-8 w-8 rounded-lg">-->
              <!--                <AvatarImage :src="user.avatar" :alt="user.name" />-->
              <!--                <AvatarFallback class="rounded-lg">-->
              <!--                  CN-->
              <!--                </AvatarFallback>-->
              <!--              </Avatar>-->
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ username }}</span>
                <span class="text-muted-foreground truncate text-xs">
                  {{ role }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <!--          <DropdownMenuGroup>-->
          <!--            <DropdownMenuItem>-->
          <!--              <IconUserCircle />-->
          <!--              Account-->
          <!--            </DropdownMenuItem>-->
          <!--            <DropdownMenuItem>-->
          <!--              <IconCreditCard />-->
          <!--              Billing-->
          <!--            </DropdownMenuItem>-->
          <!--            <DropdownMenuItem>-->
          <!--              <IconNotification />-->
          <!--              Notifications-->
          <!--            </DropdownMenuItem>-->
          <!--          </DropdownMenuGroup>-->
          <!--          <DropdownMenuSeparator />-->
          <DropdownMenuItem @click="logout()">
            <Icon name="lucide:log-out" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
