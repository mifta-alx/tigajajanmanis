import type { ColumnDef } from "@tanstack/vue-table";
import type { Product } from "~/types/product";
import { h } from "vue";
import { NuxtImg } from "#components";
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
import { formatPrice } from "~/lib/utils";

export const getColumns = (
  onDelete: (id: string) => void,
  onStatusChange: (id: string, newStatus: boolean) => void,
  onEdit: (product: Product) => void,
  updatingIds: Ref<Set<string>>,
): ColumnDef<Product>[] => [
  {
    accessorKey: "number",
    header: () => h("div", { class: "text-center" }, "No"),
    size: 64,
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
  },
  {
    accessorKey: "name",
    size: 240,
    header: () => h("div", { class: "text-left" }, "Product"),
    cell: ({ row }) => {
      const product = row.original;
      const firstLetter = product.name.substring(0, 1);
      const imageSrc =
        product.image_url && product.image_url !== ""
          ? product.image_url
          : `https://placehold.co/32x32?text=${firstLetter}`;
      return h("div", { class: "flex items-center gap-2" }, [
        h(NuxtImg as any, {
          class: "size-8 rounded-sm object-cover",
          src: imageSrc,
          alt: product.name,
        }),

        h("div", { class: "flex flex-col" }, [
          h("p", { class: "text-sm font-medium" }, row.getValue("name")),
          h(
            "p",
            { class: "text-xs font-normal text-muted-foreground" },
            product.merchant_name,
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "sku",
    header: () => h("div", { class: "text-left" }, "SKU"),
    cell: ({ row }) => {
      const val = row.getValue("sku") as string;
      const sku = val && val.trim() !== "" ? val : "-";
      return h("div", { class: "text-muted-foreground" }, sku);
    },
  },
  {
    accessorKey: "cost_price",
    size: 140,
    header: () => h("div", { class: "text-left" }, "Cost price"),
    cell: ({ row }) => {
      const val = row.getValue("cost_price") as number;
      const cost_price = formatPrice(val);
      return h("div", { class: "text-muted-foreground" }, cost_price);
    },
  },
  {
    accessorKey: "selling_price",
    size: 140,
    header: () => h("div", { class: "text-left" }, "Selling price"),
    cell: ({ row }) => {
      const val = row.getValue("selling_price") as number;
      const selling_price = formatPrice(val);
      return h("div", { class: "text-muted-foreground" }, selling_price);
    },
  },
  {
    accessorKey: "profit",
    size: 100,
    header: () => h("div", { class: "text-left" }, "Profit"),
    cell: ({ row }) => {
      const val = row.getValue("profit") as number;
      const profit = formatPrice(val);
      return h(
        "div",
        {
          class:
            val > 0
              ? "text-green-600 dark:text-green-500"
              : "text-muted-foreground",
        },
        profit,
      );
    },
  },
  {
    accessorKey: "stock",
    size: 64,
    header: () => h("div", { class: "text-center" }, "Stock"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-center text-muted-foreground" },
        row.getValue("stock"),
      ),
  },
  {
    accessorKey: "status",
    header: () => h("div", { class: "text-center" }, "Status"),
    size: 64,
    cell: ({ row }) => {
      const product = row.original;
      const isLoading = updatingIds.value.has(product.id);

      return h("div", { class: "flex items-center justify-center" }, [
        h(Switch, {
          checked: product.is_active,
          disabled: isLoading,
          key: `switch-${product.id}`,
          onChange: (val: boolean) => {
            onStatusChange(product.id, val);
          },
        }),
      ]);
    },
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const merchant = row.original;

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
                        onClick: () => onEdit(merchant),
                      },
                      () => "Edit",
                    ),
                    h(DropdownMenuSeparator, {}),
                    h(
                      DropdownMenuItem,
                      { onClick: () => onDelete(merchant.id) },
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
