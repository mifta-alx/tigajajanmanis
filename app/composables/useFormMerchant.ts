import type { Merchant } from "~/types/merchant";
import { useMerchant } from "~/composables/useMerchant";
import { z } from "zod";
import { useForm } from "@tanstack/vue-form";

export const useFormMerchant = (props: {
  merchant?: Merchant | null;
  onSuccess: () => void;
}) => {
  const { uploadImage } = useUploadStorage();
  const { createMerchant, updateMerchant } = useMerchant();
  const { success, error } = useToast();
  const loading = ref(false);

  const logoFile = ref<File | null | undefined>(undefined);

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Merchant name is required")
      .min(3, "Merchant name must be at least 3 characters"),

    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),

    address: z.string(),
    logo_url: z.string(),
    logo_file: z.any(),
  });

  const form = useForm({
    defaultValues: {
      name: props.merchant?.name ?? "",
      phone_number: props.merchant?.phone_number ?? "",
      address: props.merchant?.address ?? "",
      logo_url: props.merchant?.logo_url ?? "",
      logo_file: undefined as File | null | undefined,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;

      const actionText = props.merchant ? "updated" : "created";
      try {
        if (props.merchant) {
          await updateMerchant(
            props.merchant.id,
            {
              name: value.name,
              phone_number: value.phone_number,
              address: value.address,
              logo_url: props.merchant?.logo_url,
            },
            logoFile.value,
          );
        } else {
          let logoUrl: string | null = null;

          if (logoFile.value instanceof File) {
            logoUrl = await uploadImage("merchants", logoFile.value);
          }
          await createMerchant({
            name: value.name,
            phone_number: value.phone_number,
            address: value.address,
            logo_url: logoUrl,
          });
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

  return { form, loading, logoFile };
};
