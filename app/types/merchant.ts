import type { Merchant } from "./models";

export type CreateMerchantDTO = Omit<
  Merchant,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export type UpdateMerchantDTO = Partial<CreateMerchantDTO>;

export interface MerchantWithProfile extends Omit<
  Merchant,
  "created_by" | "created_at" | "updated_at"
> {
  creator_name: string;
}
