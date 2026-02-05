import { z } from "zod";
import { useForm } from "@tanstack/vue-form";
import type { Outlet } from "~/types/outlet";

export const useFormOutlet = (props: {
  outlet?: Outlet | null;
  onSuccess: () => void;
}) => {
  const { createOutlet, updateOutlet } = useOutlet();
  const { success, error } = useToast();
  const loading = ref(false);
  const isEdit = !!props.outlet;

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Outlet name is required")
      .min(3, "Outlet name must be at least 3 characters")
      .max(100, "Outlet name is too long"),
    address: z.string(),
  });

  const form = useForm({
    defaultValues: {
      name: props.outlet?.name ?? "",
      address: props.outlet?.address ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;
      const actionText = isEdit ? "updated" : "created";
      try {
        if (props.outlet) {
          await updateOutlet(props.outlet.id, {
            ...value,
          });
        } else {
          await createOutlet(value);
        }
        success(`Outlet ${actionText} successfully`);
        props.onSuccess();
      } catch (err: any) {
        error(err.statusMessage ?? `Failed to ${actionText} outlet`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, isEdit };
};
