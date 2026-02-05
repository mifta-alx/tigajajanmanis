import type { MerchantEntity } from "./models";

export type CreateMerchantDTO = Omit<
  MerchantEntity,
  "id" | "is_active" | "created_at" | "updated_at"
>;

export interface MerchantInput extends Omit<
  MerchantEntity,
  "id" | "is_active" | "created_at" | "updated_at" | "created_by" | "image_url"
> {
  outlet_ids?: string[];
}

export type UpdateMerchantDTO = Partial<CreateMerchantDTO> & {
  outlet_ids?: string[];
};

export interface Merchant extends Omit<
  MerchantEntity,
  "created_by" | "created_at" | "updated_at"
> {
  creator_name: string;
  outlet_merchants?: {
    outlet_id: string;
    outlets: { name: string } | null;
  }[];
}

export interface SimpleMerchants {
  id: string;
  name: string;
  image_url: string;
  product_count: number;
  outlets: {
    id: string;
    name: string | null;
  }[];
}
