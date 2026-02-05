import type { StockEntity } from "./models";

export type CreateStockDTO = Omit<
  StockEntity,
  "id" | "created_at" | "updated_at"
>;

export type UpdateStockDTO = Partial<CreateStockDTO>;

export interface Stock extends Omit<
  StockEntity,
  "outlet_id" | "merchant_id" | "created_by" | "updated_at"
> {
  merchant_name: string;
  outlet_name: string;
  product_name: string;
  creator_name: string;
  sku: string;
  image_url: string | null;
}
