import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Badge } from "~/components/ui/badge";
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
import type { User } from "~/types/profiles";

export const getColumns = (
  onDelete: (id: string) => void,
  onStatusChange: (id: string, newStatus: number) => void,
  onEdit: (user: User) => void,
  currentUserId: string | undefined,
  updatingIds: Ref<Set<string>>,
): ColumnDef<User>[] => [
  {
    accessorKey: "number",
    header: () => h("div", { class: "text-center" }, "No"),
    size: 100,
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
  },
  {
    accessorKey: "username",
    size: 140,
    header: () => h("div", { class: "text-left" }, "Username"),
    cell: ({ row }) => h("div", { class: "" }, row.getValue("username")),
  },
  {
    accessorKey: "fullname",
    size: 240,
    header: () => h("div", { class: "text-left" }, "Full name"),
    cell: ({ row }) =>
      h("div", { class: "capitalize" }, row.getValue("fullname")),
  },
  {
    accessorKey: "address",
    size: 280,
    header: () => h("div", { class: "text-left" }, "Address"),
    cell: ({ row }) => {
      const val = row.getValue("address") as string;
      const address = val && val.trim() !== "" ? val : "-";
      return h("div", { class: "text-wrap" }, address);
    },
  },
  {
    accessorKey: "role",
    header: () => h("div", { class: "text-center" }, "Role"),
    size: 80,
    cell: ({ row }) => {
      const roleValue = row.getValue("role") as string;

      return h("div", { class: "flex items-center justify-center gap-1" }, [
        h(
          Badge,
          { variant: "secondary", class: "capitalize" },
          { default: () => roleValue },
        ),
      ]);
    },
  },
  {
    accessorKey: "status",
    header: () => h("div", { class: "text-center" }, "Status"),
    size: 64,
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.id === currentUserId;
      const isLoading = updatingIds.value.has(user.id);
      if (isCurrentUser) {
        return h("div", { class: "w-[64px]" }, "");
      }

      return h("div", { class: "flex items-center justify-center" }, [
        h(Switch, {
          checked: user.status === 1,
          disabled: isLoading || isCurrentUser,
          key: `switch-${user.id}`,
          onChange: (val: boolean) => {
            onStatusChange(user.id, val ? 1 : 0);
          },
        }),
      ]);
    },
  },
  {
    id: "actions",
    size: 100,
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.id === currentUserId;
      const phoneNumber = user.phone_number;

      if (isCurrentUser) {
        return h("div", { class: "w-[100px]" }, "");
      }

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
                        onClick: () => onEdit(user),
                      },
                      () => "Edit",
                    ),
                    h(DropdownMenuSeparator, {}),
                    h(
                      DropdownMenuItem,
                      { onClick: () => onDelete(user.id) },
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
