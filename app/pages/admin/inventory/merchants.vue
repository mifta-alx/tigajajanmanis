<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

useSeoMeta({
  title: "Admin | Catalog > Vendors",
  ogTitle: "Admin | Catalog > Vendors",
  description: "",
  ogDescription: "",
});
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Input
          id="keyword"
          type="text"
          placeholder="Search vendor"
          class="w-full md:max-w-sm"
        />
        <Button class="w-full md:w-fit"> Add Vendor</Button>
      </div>
    </CardHeader>
    <CardContent> </CardContent>
  </Card>
</template>
