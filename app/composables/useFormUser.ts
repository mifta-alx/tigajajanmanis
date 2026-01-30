import type { User } from "~/types/models";
import { z } from "zod";
import type { Role } from "~/types/role";
import { useForm } from "@tanstack/vue-form";

export const useFormUser = (props: {
  user?: User | null;
  onSuccess: () => void;
}) => {
  const { createUser, updateUser } = useUser();
  const { success, error } = useToast();
  const loading = ref(false);
  const isEdit = !!props.user;

  const formSchema = z.object({
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

    fullName: z
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
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[0-9]/, "Password must contain at least one number"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),

    address: z.string(),

    role: z.custom<Role>((val) => ["admin", "staff"].includes(val as Role), {
      message: "Please select a valid role",
    }),
  });

  const form = useForm({
    defaultValues: {
      username: props.user?.username ?? "",
      fullName: props.user?.fullName ?? "",
      password: "",
      phoneNumber: props.user?.phoneNumber ?? "",
      address: props.user?.address ?? "",
      role: (props.user?.role as Role) ?? ("" as Role),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;
      const actionText = isEdit ? "updated" : "created";
      try {
        if (props.user) {
          await updateUser(props.user.id, {
            fullName: value.fullName,
            phoneNumber: value.phoneNumber,
            address: value.address,
            role: value.role as Role,
          });
        } else {
          await createUser({ ...value, status: 1 });
        }
        success(`User ${actionText} successfully`);
        props.onSuccess();
      } catch (err) {
        error(`Failed to ${actionText} user`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, isEdit };
};
