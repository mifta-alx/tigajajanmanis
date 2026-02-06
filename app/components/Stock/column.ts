import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { Button } from "~/components/ui/button";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Stock } from "~/types/stock";

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (log: Stock) => void,
): ColumnDef<Stock>[] => [
  {
    accessorKey: "product_name",
    size: 280,
    header: () => h("div", { class: "text-left px-2" }, "Item"),
    cell: ({ row }) => {
      const stock = row.original;
      const firstLetter = stock.product_name.substring(0, 1);
      const imageSrc =
        stock.image_url && stock.image_url !== ""
          ? stock.image_url
          : `https://placehold.co/32x32?text=${firstLetter}`;
      return h("div", { class: "flex items-center gap-2 px-2" }, [
        h(ImageWithFallback, {
          class: "size-8 rounded-sm",
          imgClass: "size-8 rounded-sm",
          skeletonClass: "size-8 rounded-sm",
          src: imageSrc,
          alt: stock.product_name,
        }),

        h("div", { class: "flex flex-col" }, [
          h(
            "p",
            { class: "text-sm font-medium text-wrap" },
            row.getValue("product_name"),
          ),
          h(
            "p",
            { class: "text-xs font-normal text-muted-foreground" },
            stock.merchant_name,
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "outlet_name",
    size: 180,
    header: () => h("div", { class: "text-left" }, "Outlet"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-wrap text-muted-foreground" },
        row.getValue("outlet_name"),
      ),
  },
  {
    accessorKey: "quantity",
    size: 64,
    header: () => h("div", { class: "text-center" }, "Qty"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-muted-foreground text-center" },
        row.getValue("quantity"),
      );
    },
  },
  {
    accessorKey: "created_at",
    size: 140,
    header: () => h("div", { class: "text-left" }, "Timestamp"),
    cell: ({ row }) => {
      const stock = row.original;
      const date = new Date(stock.created_at);
      const formatted = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(date)
        .replace(/\./g, ":");
      return h(
        "div",
        {
          class: "text-muted-foreground text-left tracking-tighter",
        },
        formatted,
      );
    },
  },
  {
    accessorKey: "creator_name",
    header: () => h("div", { class: "text-left" }, "Staff"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-muted-foreground" },
        row.getValue("creator_name"),
      ),
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const log = row.original;

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
                        onClick: () => onEdit(log),
                      },
                      () => "Edit",
                    ),
                    h(DropdownMenuSeparator, {}),
                    h(
                      DropdownMenuItem,
                      { onClick: () => onDelete(log.id) },
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
