<template>
  <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset class="min-w-0 flex-1 overflow-hidden">
      <header
        class="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
            orientation="vertical"
            class="mr-2 data-[orientation=vertical]:h-4"
          />
          <BreadcrumbLayout />
        </div>
      </header>
      <div class="flex flex-1 flex-col p-4 gap-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
