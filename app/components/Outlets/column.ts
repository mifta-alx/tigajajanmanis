import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import Switch from "~/components/Switch.vue";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Outlet } from "~/types/outlet";

export const getColumns = (
  onDelete: (id: string) => void,
  onStatusChange: (id: string, newStatus: boolean) => void,
  onEdit: (outlet: Outlet) => void,
  updatingIds: Ref<Set<string>>,
): ColumnDef<Outlet>[] => [
  {
    accessorKey: "number",
    header: () => h("div", { class: "text-center" }, "No"),
    size: 64,
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
  },
  {
    accessorKey: "name",
    size: 240,
    header: () => h("div", { class: "text-left" }, "Outlet"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-sm font-medium text-wrap" },
        row.getValue("name"),
      ),
  },
  {
    accessorKey: "address",
    size: 280,
    header: () => h("div", { class: "text-left" }, "Address"),
    cell: ({ row }) => {
      const val = row.getValue("address") as string;
      const address = val && val.trim() !== "" ? val : "-";
      return h("div", { class: "text-wrap text-muted-foreground" }, address);
    },
  },
  {
    accessorKey: "status",
    header: () => h("div", { class: "text-center" }, "Status"),
    size: 64,
    cell: ({ row }) => {
      const outlet = row.original;
      const isLoading = updatingIds.value.has(outlet.id);

      return h("div", { class: "flex items-center justify-center" }, [
        h(Switch, {
          checked: outlet.is_active,
          disabled: isLoading,
          key: `switch-${outlet.id}`,
          onChange: (val: boolean) => {
            onStatusChange(outlet.id, val);
          },
        }),
      ]);
    },
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const outlet = row.original;

      return h("div", { class: "flex items-center justify-end gap-2" }, [
        h(
          DropdownMenu,
          {},
          {
            default: () => [
              h(
                DropdownMenuTrigger,
                { asChild: true },
                {
                  default: () =>
                    h(
                      Button,
                      {
                        variant: "ghost",
                        class: "h-8 w-8 p-0",
                      },
                      {
                        default: () => [
                          h("span", { class: "sr-only" }, "Open menu"),
                          h(Icon, {
                            class: "h-4 w-4",
                            icon: "lucide:ellipsis-vertical",
                          }),
                        ],
                      },
                    ),
                },
              ),
              h(
                DropdownMenuContent,
                { align: "end" },
                {
                  default: () => [
                    h(
                      DropdownMenuItem,
                      {
                        onClick: () => onEdit(outlet),
                      },
                      () => "Edit",
                    ),
                    h(DropdownMenuSeparator, {}),
                    h(
                      DropdownMenuItem,
                      { onClick: () => onDelete(outlet.id) },
                      () => "Delete",
                    ),
                  ],
                },
              ),
            ],
          },
        ),
      ]);
    },
  },
];
