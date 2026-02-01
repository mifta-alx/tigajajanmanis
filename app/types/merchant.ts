import type { MerchantEntity } from "./models";

export type CreateMerchantDTO = Omit<
  MerchantEntity,
  "id" | "is_active" | "creator_name" | "created_at" | "updated_at"
>;

export type UpdateMerchantDTO = Partial<CreateMerchantDTO>;

export type Merchant = Omit<
  MerchantEntity,
  "created_by" | "created_at" | "updated_at"
>;
