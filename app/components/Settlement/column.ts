import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Icon } from "@iconify/vue";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import type { Stock } from "~/types/stock";

export const getColumns = (
  onSettle: (log: Stock) => void,
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
          class: "size-8 rounded-sm shrink-0",
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
            { class: "text-xs font-normal text-muted-foreground text-wrap" },
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
    accessorKey: "total_in",
    size: 80,
    header: () => h("div", { class: "text-center" }, "Stock In"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-muted-foreground text-center" },
        row.getValue("total_in"),
      );
    },
  },
  {
    accessorKey: "total_sold",
    size: 64,
    header: () => h("div", { class: "text-center" }, "Sold"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-muted-foreground text-center" },
        row.getValue("total_sold"),
      );
    },
  },
  {
    accessorKey: "total_settle",
    size: 96,
    header: () => h("div", { class: "text-center" }, "Returned"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-muted-foreground text-center" },
        row.getValue("total_settle"),
      );
    },
  },
  {
    accessorKey: "current_stock",
    size: 96,
    header: () => h("div", { class: "text-center" }, "Remaining"),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-muted-foreground text-center" },
        row.getValue("current_stock"),
      );
    },
  },
  {
    id: "actions",
    size: 120,
    cell: ({ row }) => {
      const stock = row.original;
      const isSettled = (stock.current_stock ?? 0) <= 0;

      return h("div", { class: "flex items-center justify-end px-2" }, [
        isSettled
          ? h(Badge, {}, () => "Returned")
          : h(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => onSettle(stock),
              },
              () => [
                h(Icon, { icon: "lucide:rotate-ccw", class: "size-3" }),
                "Return",
              ],
            ),
      ]);
    },
  },
];
