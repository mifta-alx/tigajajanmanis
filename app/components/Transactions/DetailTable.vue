<script setup lang="ts" generic="TData, TValue">
import {
  type ColumnDef,
  getPaginationRowModel,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}>();

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});
</script>

<template>
  <div class="overflow-hidden">
    <Table class="table-fixed">
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :style="{
              width: `${header.getSize()}px`,
              minWidth: `${header.getSize()}px`,
            }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="props.loading">
          <TableRow v-for="i in 10" :key="`skeleton-${i}`">
            <TableCell
              v-for="j in columns.length"
              :key="`cell-${j}`"
              class="h-9"
            >
              <Skeleton class="h-3 w-full animate-pulse bg-muted" />
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :style="{ width: `${cell.column.getSize()}px` }"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
