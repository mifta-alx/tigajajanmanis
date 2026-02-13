import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Badge } from "~/components/ui/badge";
import { formatDate, formatPrice } from "~/lib/utils";
import {
  TransactionStatusConfig,
  PaymentMethodString,
} from "~/types/transaction";
import { NuxtLink } from "#components";

const getStatusConfig = (status: string) => {
  return (
    TransactionStatusConfig[status as keyof typeof TransactionStatusConfig] ||
    TransactionStatusConfig.PENDING
  );
};

export const getColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "number",
    header: () => h("div", { class: "text-center" }, "No"),
    size: 64,
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
  },
  {
    accessorKey: "queue_number",
    size: 100,
    header: () => h("div", { class: "text-left" }, "Order"),
    cell: ({ row }) => {
      const id = row.original.id;
      return h(
        NuxtLink,
        {
          to: `/admin/sales/${id}`,
          class:
            "flex items-center gap-2 text-primary font-semibold transition-all",
        },
        {
          default: () =>
            h("p", { class: "text-wrap" }, row.getValue("queue_number")),
        },
      );
    },
  },
  {
    accessorKey: "created_at",
    size: 200,
    header: () => h("div", { class: "text-left" }, "Date"),
    cell: ({ row }) => {
      const val = row.getValue("created_at") as string;
      const date = `${formatDate(val, "dd MMM yyyy, HH:mm")} WIB`;
      return h("div", { class: "text-wrap text-muted-foreground" }, date);
    },
  },
  {
    accessorKey: "outlet_id",
    header: () => h("div", { class: "text-left" }, "Outlet"),
    cell: ({ row }) => {
      const outletName = row.original.outlets.name;
      return h("div", { class: "text-muted-foreground text-wrap" }, outletName);
    },
  },
  {
    accessorKey: "payment_type",
    size: 124,
    header: () => h("div", { class: "text-center" }, "Payment"),
    cell: ({ row }) => {
      const type = row.original
        .payment_type as keyof typeof PaymentMethodString;
      const method = PaymentMethodString[type];
      return h("div", { class: "flex items-center justify-center gap-1" }, [
        h(Badge, { variant: "secondary" }, { default: () => method }),
      ]);
    },
  },
  {
    accessorKey: "status",
    size: 140,
    header: () => h("div", { class: "text-center" }, "Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      const config = getStatusConfig(status);

      return h("div", { class: "flex items-center justify-center gap-2" }, [
        h("div", { class: `size-2 rounded-full ${config.bg}` }),
        h(
          "span",
          { class: `text-sm font-medium ${config.color}` },
          config.label,
        ),
      ]);
    },
  },
  {
    accessorKey: "total_price",
    header: () => h("div", { class: "text-left" }, "Total"),
    cell: ({ row }) => {
      const totalPrice = formatPrice(row.original.total_price);
      return h("div", { class: "text-wrap" }, totalPrice);
    },
  },
  {
    accessorKey: "cashier_id",
    size: 120,
    header: () => h("div", { class: "text-left" }, "Staff"),
    cell: ({ row }) => {
      const staffName = row.original.profiles.fullname;
      return h("div", { class: "text-muted-foreground text-wrap" }, staffName);
    },
  },
];
