import type { ProductEntity } from "./models";

export type CreateProductDTO = Omit<
  ProductEntity,
  "id" | "is_active" | "sku" | "created_at" | "updated_at"
>;

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface Product extends Omit<
  ProductEntity,
  "created_by" | "created_at" | "updated_at"
> {
  profit: number;
  merchant_name: string;
  stock: number;
  inventory_details?: {
    outlet_name: string;
    qty: number;
  }[];
}

export interface MerchantProduct {
  id: string;
  merchant_id: string;
  merchant_name: string;
  name: string;
  selling_price: number;
  sku: string;
  image_url: string;
  current_stock: number;
}
