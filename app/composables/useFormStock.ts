import { z } from "zod";
import { useForm } from "@tanstack/vue-form";
import type { CreateStockDTO } from "~/types/stock";

export const useFormStock = (props: {
  initialDate?: string;
  onSuccess: () => void;
}) => {
  const { addBulkStock } = useStock();
  const { success, error } = useToast();
  const loading = ref(false);
  const globalError = ref<string | null>(null);
  const form = useForm({
    defaultValues: {
      merchant_id: "",
      outlet_id: "",
      items: [] as Array<{ product_id: string; quantity: number }>,
    },
    validators: {
      onSubmit: ({ value }) => {
        const validItems = value.items.filter((item) => item.quantity > 0);
        if (validItems.length === 0) {
          const msg = "Please fill at least one product quantity";
          globalError.value = msg;
          return msg;
        }
        globalError.value = null;
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const payload: Omit<CreateStockDTO, "created_by">[] = value.items
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          merchant_id: value.merchant_id as string,
          outlet_id: value.outlet_id as string,
          product_id: item.product_id as string,
          quantity: item.quantity as number,
          type: "IN",
          entry_date: props.initialDate
            ? (props.initialDate.split("T")[0] as string)
            : (new Date().toISOString().split("T")[0] as string),
        }));
      loading.value = true;

      try {
        await addBulkStock(payload);
        success(`Stock updated successfully for ${payload.length} products`);
        props.onSuccess();
      } catch (err: any) {
        error(err.message ?? "Failed to update stock");
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, globalError };
};
