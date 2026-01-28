<script setup lang="ts">
import {breadcrumbList} from "@/data/breadcrumb";
const route = useRoute();

const breadcrumbs = computed(() => {
  const pathname = route.path;

  if (breadcrumbList[pathname]) {
    return breadcrumbList[pathname];
  }
  const allPaths = Object.keys(breadcrumbList);

  for (const pathTemplate of allPaths) {
    if (!pathTemplate.includes(":")) {
      continue;
    }
    const regexPattern = pathTemplate
        .replace(/\//g, "\\/")
        .replace(/:[a-zA-Z0-9_]+/g, "([^/]+)");

    const regex = new RegExp(`^${regexPattern}$`);

    if (regex.test(pathname)) {
      return breadcrumbList[pathTemplate];
    }
  }

  return [];
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbs" :key="index">
      <BreadcrumbItem :class="{ 'hidden md:block': index < breadcrumbs.length - 1 }">
        <BreadcrumbLink v-if="item.href" as-child>
          <NuxtLink :to="item.href">{{ item.label }}</NuxtLink>
        </BreadcrumbLink>
          <BreadcrumbPage v-else>{{item.label}}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>