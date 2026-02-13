import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { TransactionStatusConfig } from "~/types/transaction";
import ImageWithFallback from "~/components/ImageWithFallback.vue";
import { formatPrice } from "~/lib/utils";

export const getColumns = (): ColumnDef<any>[] => [
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
      const product = row.original.products;
      const firstLetter = product.name.substring(0, 1);
      const imageSrc =
        product.image_url && product.image_url !== ""
          ? product.image_url
          : `https://placehold.co/32x32?text=${firstLetter}`;
      return h("div", { class: "flex items-center gap-2" }, [
        h(ImageWithFallback, {
          class: "size-8 rounded-sm shrink-0",
          imgClass: "size-8 rounded-sm",
          skeletonClass: "size-8 rounded-sm",
          src: imageSrc,
          alt: product.name,
        }),

        h("div", { class: "flex flex-col min-w-0" }, [
          h("p", { class: "text-sm font-medium text-wrap" }, product.name),
          h(
            "p",
            { class: "text-xs font-normal text-muted-foreground text-wrap" },
            product.merchants.name,
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "price",
    header: () => h("div", { class: "text-left" }, "Price"),
    cell: ({ row }) => {
      const sellingPrice = formatPrice(row.original.selling_price_at_time);
      return h("div", { class: "text-muted-foreground" }, sellingPrice);
    },
  },
  {
    accessorKey: "quantity",
    size: 96,
    header: () => h("div", { class: "text-center" }, "Quantity"),
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return h("div", { class: "text-center text-muted-foreground" }, quantity);
    },
  },
  {
    accessorKey: "total",
    header: () => h("div", { class: "text-left" }, "Total"),
    cell: ({ row }) => {
      const subTotal = formatPrice(row.original.subtotal);
      return h("div", { class: "font-semibold" }, subTotal);
    },
  },
];
