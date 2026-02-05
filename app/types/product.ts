import type { ProductEntity } from "./models";

export type CreateProductDTO = Omit<
  ProductEntity,
  "id" | "is_active" | "sku" | "stock" | "created_at" | "updated_at"
>;

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface Product extends Omit<
  ProductEntity,
  "created_by" | "created_at" | "updated_at"
> {
  profit: number;
  merchant_name: string;
}

export interface MerchantProduct {
  id: string;
  merchant_id: string;
  merchant_name: string;
  name: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  sku: string;
  image_url: string;
}
