import { z } from "zod";
import { useForm } from "@tanstack/vue-form";

export const useFormStockEdit = (props: {
  initialData: { id: string; quantity: number; product_name: string };
  onSuccess: () => void;
}) => {
  const { updateStockLog } = useStock();
  const { success, error } = useToast();
  const loading = ref(false);

  const form = useForm({
    defaultValues: {
      quantity: props.initialData.quantity,
    },
    validators: {
      onChange: z.object({
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    },
    onSubmit: async ({ value }) => {
      loading.value = true;
      try {
        await updateStockLog(props.initialData.id, {
          quantity: value.quantity,
        });
        success(`Stock for ${props.initialData.product_name} updated`);
        props.onSuccess();
      } catch (err: any) {
        error(err.message ?? "Failed to update");
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading };
};
