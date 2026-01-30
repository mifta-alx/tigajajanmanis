import type { Merchant } from "~/types/models";
import { useMerchant } from "~/composables/useMerchant";
import { z } from "zod";
import { useForm } from "@tanstack/vue-form";

export const useFormMerchant = (props: {
  merchant?: Merchant | null;
  onSuccess: () => void;
}) => {
  const { uploadLogo, createMerchant, updateMerchant } = useMerchant();
  const { success, error } = useToast();
  const loading = ref(false);
  const logoFile = ref<File | null | undefined>(undefined);
  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),

    address: z.string(),
    logoUrl: z.string(),
    logoFile: z.any(),
  });

  const form = useForm({
    defaultValues: {
      name: props.merchant?.name ?? "",
      phoneNumber: props.merchant?.phoneNumber ?? "",
      address: props.merchant?.address ?? "",
      logoUrl: props.merchant?.logoUrl ?? "",
      logoFile: undefined as File | null | undefined,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loading.value = true;

      const payload = {
        name: value.name,
        phoneNumber: value.phoneNumber,
        address: value.address || "",
        logoUrl: props.merchant?.logoUrl ?? null,
      };

      const actionText = props.merchant ? "updated" : "created";
      try {
        if (props.merchant) {
          await updateMerchant(props.merchant.id, payload, logoFile.value);
        } else {
          let logoUrl: string | null = null;
          if (logoFile.value instanceof File) {
            logoUrl = await uploadLogo(logoFile.value);
          }
          await createMerchant({
            name: payload.name,
            phoneNumber: payload.phoneNumber,
            address: payload.address,
            logoUrl,
          });
        }
        success(`Merchant ${actionText} successfully`);
        props.onSuccess();
      } catch (err) {
        error(`Failed to ${actionText} user`);
      } finally {
        loading.value = false;
      }
    },
  });

  return { form, loading, logoFile };
};
