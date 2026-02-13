<script setup lang="ts">
import { LogOut } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";
import type { Role } from "~/types/role";
const { logout } = useAuth();
const user = useSupabaseUser();
const { isMobile } = useSidebar();
const role = user.value?.app_metadata?.role as Role | undefined;
const fullname = user?.value?.user_metadata?.fullname as string;
const initials = computed(() => {
  if (!fullname) return "U";

  return fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
});
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-accent data-[state=open]:text-foreground data-[active=true]:bg-accent data-[active=true]:text-foreground hover:bg-accent hover:text-foreground active:bg-accent active:text-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg grayscale">
              <AvatarFallback class="rounded-lg">
                {{ initials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ fullname }}</span>
              <span class="text-muted-foreground truncate text-xs capitalize">
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
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarFallback class="rounded-lg">
                  {{ initials }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ fullname }}</span>
                <span class="text-muted-foreground truncate text-xs capitalize">
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
            <LogOut class="size-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
