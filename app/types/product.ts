import type { ProductEntity } from "./models";

export type CreateProductDTO = Omit<
  ProductEntity,
  | "id"
  | "is_active"
  | "sku"
  | "stock"
  | "creator_name"
  | "created_at"
  | "updated_at"
>;

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface Product extends Omit<
  ProductEntity,
  "created_by" | "created_at" | "updated_at"
> {
  profit: number;
  merchant_name: string;
}
