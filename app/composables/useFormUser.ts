import { z } from "zod";
import type { Role } from "~/types/role";
import { useForm } from "@tanstack/vue-form";
import type { User } from "~/types/profiles";

export const useFormUser = (props: {
  user?: User | null;
  onSuccess: () => void;
}) => {
  const { createUser, updateUser } = useUser();
  const { success, error } = useToast();
  const loading = ref(false);
  const isEdit = !!props.user;

  const formSchema = z
    .object({
      username: !!props.user
        ? z.string()
        : z
            .string()
            .toLowerCase()
            .trim()
            .min(1, "Username is required")
            .min(5, "Username must be at least 5 characters.")
            .max(32, "Username must be at most 20 characters.")
            .regex(/^\S+$/, "Username cannot contain spaces"),

      fullname: z
        .string()
        .min(1, "Full name is required")
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name is too long"),

      password: isEdit
        ? z.string()
        : z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(
              /[A-Z]/,
              "Password must contain at least one uppercase letter",
            )
            .regex(/[0-9]/, "Password must contain at least one number"),

      phone_number: z
        .string()
        .min(1, "Phone number is required")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
      outlet_id: z.string().nullable(),
      address: z.string(),

      role: z.custom<Role>((val) => ["admin", "staff"].includes(val as Role), {
        message: "Please select a valid role",
      }),
    })
    .refine(
      (data) => {
        if (data.role === "staff" && !data.outlet_id) {
          return false;
        }
        return true;
      },
      {
        message: "Outlet is required for staff",
        path: ["outlet_id"],
      },
    );

  const form = useForm({
    defaultValues: {
      username: props.user?.username ?? "",
      fullname: props.user?.fullname ?? "",
      password: "",
      phone_number: props.user?.phone_number ?? "",
      outlet_id: props.user?.outlet_id ?? null,
      address: props.user?.address ?? "",
      role: (props.user?.role as Role) ?? ("" as Role),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;
      const actionText = isEdit ? "updated" : "created";
      const payload = {
        ...value,
        outlet_id: value.role === "admin" ? null : value.outlet_id,
      };
      try {
        if (props.user) {
          await updateUser(props.user.id, payload);
        } else {
          await createUser(payload);
        }
        success(`User ${actionText} successfully`);
        props.onSuccess();
      } catch (err: any) {
        error(err.statusMessage ?? `Failed to ${actionText} user`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, isEdit };
};
