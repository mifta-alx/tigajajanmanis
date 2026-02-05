import type { Product } from "~/types/product";
import { z } from "zod";
import { useForm } from "@tanstack/vue-form";

export const useFormProduct = (props: {
  product?: Product | null;
  onSuccess: () => void;
}) => {
  const { createProduct, updateProduct } = useProduct();
  const { success, error } = useToast();
  const loading = ref(false);

  const imageFile = ref<File | null | undefined>(undefined);

  const formSchema = z.object({
    merchant_id: z.string().min(1, "Please select a merchant"),
    name: z
      .string()
      .min(1, "Product name is required")
      .min(3, "Product name must be at least 3 characters"),

    cost_price: z.coerce.number().min(0, "Minimum price is 0"),
    selling_price: z.coerce.number().min(0, "Minimum price is 0"),
    image_url: z.string(),
    image_file: z.instanceof(File).optional().nullable().or(z.undefined()),
  });

  const form = useForm({
    defaultValues: {
      merchant_id: props.product?.merchant_id ?? "",
      name: props.product?.name ?? "",
      cost_price: props.product?.cost_price ?? 0,
      selling_price: props.product?.selling_price ?? 0,
      image_url: props.product?.image_url ?? "",
      image_file: undefined as File | null | undefined,
    },
    validators: {
      onSubmit: formSchema.refine(
        (data) => data.selling_price >= data.cost_price,
        {
          message: "Selling price should not be lower than cost price",
          path: ["selling_price"],
        },
      ) as any,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;

      const actionText = props.product ? "updated" : "created";

      const payload = {
        merchant_id: value.merchant_id,
        name: value.name,
        cost_price: value.cost_price ?? 0,
        selling_price: value.selling_price ?? 0,
        image_url: props.product?.image_url ?? "",
      };
      try {
        if (props.product) {
          await updateProduct(props.product.id, payload, imageFile.value);
        } else {
          await createProduct(payload, imageFile.value);
        }
        success(`Product ${actionText} successfully`);
        props.onSuccess();
      } catch (err: any) {
        error(err.statusMessage ?? `Failed to ${actionText} product`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, imageFile };
};
