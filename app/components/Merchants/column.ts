import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import type { Merchant } from "~/types/merchant";
import { Button } from "~/components/ui/button";
import Switch from "~/components/Switch.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "@iconify/vue";
import { NuxtImg } from "#components";

export const getColumns = (
  onDelete: (id: string) => void,
  onStatusChange: (id: string, newStatus: boolean) => void,
  onEdit: (merchant: Merchant) => void,
  updatingIds: Ref<Set<string>>,
): ColumnDef<Merchant>[] => [
  {
    accessorKey: "number",
    header: () => h("div", { class: "text-center" }, "No"),
    size: 64,
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
  },
  {
    accessorKey: "name",
    size: 200,
    header: () => h("div", { class: "text-left" }, "Merchant"),
    cell: ({ row }) => {
      const merchant = row.original;
      const firstLetter = merchant.name.substring(0, 1);
      const imageSrc =
        merchant.image_url && merchant.image_url !== ""
          ? merchant.image_url
          : `https://placehold.co/32x32?text=${firstLetter}`;
      return h("div", { class: "flex items-center gap-2" }, [
        h(NuxtImg as any, {
          class: "size-8 rounded-sm object-cover",
          src: imageSrc,
          alt: merchant.name,
        }),

        h("p", {}, row.getValue("name")),
      ]);
    },
  },
  {
    accessorKey: "address",
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
      const merchant = row.original;
      const isLoading = updatingIds.value.has(merchant.id);

      return h("div", { class: "flex items-center justify-center" }, [
        h(Switch, {
          checked: merchant.is_active,
          disabled: isLoading,
          key: `switch-${merchant.id}`,
          onChange: (val: boolean) => {
            onStatusChange(merchant.id, val);
          },
        }),
      ]);
    },
  },
  {
    accessorKey: "creator_name",
    size: 200,
    header: () => h("div", { class: "text-left" }, "Created by"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-muted-foreground" },
        row.getValue("creator_name"),
      ),
  },
  {
    id: "actions",
    size: 100,
    cell: ({ row }) => {
      const merchant = row.original;
      const phoneNumber = merchant.phone_number;

      return h("div", { class: "flex items-center justify-end gap-2" }, [
        h(
          Button,
          {
            disabled: !phoneNumber || phoneNumber === "-" || phoneNumber === "",
            variant: "ghost",
            size: "icon",
            class:
              "h-8 w-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700",
            onClick: () => {
              if (!phoneNumber) return alert("Nomor HP tidak tersedia");
              const formattedPhone = phoneNumber
                .replace(/\D/g, "")
                .replace(/^0/, "62");
              window.open(`https://wa.me/${formattedPhone}`, "_blank");
            },
          },
          {
            default: () => h(Icon, { icon: "cib:whatsapp", class: "size-4" }),
          },
        ),

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
