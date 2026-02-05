import type { Merchant } from "~/types/merchant";
import { useMerchant } from "~/composables/useMerchant";
import { z } from "zod";
import { useForm } from "@tanstack/vue-form";

export const useFormMerchant = (props: {
  merchant?: Merchant | null;
  onSuccess: () => void;
}) => {
  const { createMerchant, updateMerchant } = useMerchant();
  const { success, error } = useToast();
  const loading = ref(false);

  const imageFile = ref<File | null | undefined>(undefined);

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Merchant name is required")
      .min(3, "Merchant name must be at least 3 characters"),

    phone_number: z
      .string()
      .transform((val) => val ?? "")
      .refine(
        (val) => !val || val.length >= 10,
        "Phone number must be at least 10 digits",
      )
      .refine(
        (val) => !val || val.length <= 15,
        "Phone number must be at most 15 digits",
      )
      .refine(
        (val) => !val || /^[0-9]+$/.test(val),
        "Phone number must contain only numbers",
      ),

    address: z.string(),
    image_url: z.string(),
    image_file: z.any(),
    outlet_ids: z.array(z.string()).default([]),
  });

  const form = useForm({
    defaultValues: {
      name: props.merchant?.name ?? "",
      phone_number: props.merchant?.phone_number ?? "",
      address: props.merchant?.address ?? "",
      image_url: props.merchant?.image_url ?? "",
      image_file: undefined as File | null | undefined,
      outlet_ids: props.merchant?.outlet_merchants
        ? props.merchant.outlet_merchants.map((om) => om.outlet_id)
        : [],
    },
    validators: {
      onSubmit: formSchema as any,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;

      const actionText = props.merchant ? "updated" : "created";

      const payload = {
        name: value.name,
        phone_number: value.phone_number || null,
        address: value.address,
        image_url: value.image_url ?? "",
        outlet_ids: value.outlet_ids,
      };
      try {
        if (props.merchant) {
          await updateMerchant(props.merchant.id, payload, imageFile.value);
        } else {
          await createMerchant(payload, imageFile.value);
        }
        success(`Merchant ${actionText} successfully`);
        props.onSuccess();
      } catch (err) {
        error(`Failed to ${actionText} merchant`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, imageFile };
};
