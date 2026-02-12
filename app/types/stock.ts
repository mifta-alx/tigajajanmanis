import type { StockEntity, StockLogType } from "./models";

export type CreateStockDTO = Omit<
  StockEntity,
  "id" | "created_at" | "updated_at"
>;

export type UpdateStockDTO = Partial<CreateStockDTO>;

export interface Stock extends Omit<StockEntity, "created_by" | "updated_at"> {
  merchant_name: string;
  outlet_name: string;
  product_name: string;
  creator_name: string;
  sku: string;
  image_url: string | null;
  current_stock?: number;
}

export interface StockLogRaw {
  product_id: string;
  quantity: number;
  type: StockLogType;
  entry_date: string;
  products: {
    name: string;
    sku: string;
    image_url: string | null;
    selling_price: number;
  };
  merchants: { name: string };
}

export interface SettlementGroupedItem {
  product_id: string;
  entry_date: string;
  product_name: string;
  selling_price: number;
  sku: string;
  image_url: string | null;
  merchant_name: string;
  total_sold: number;
  current_stock: number;
  _total_in: number;
  _total_settle: number;
}

export interface SettlementProduct {
  product_id: string;
  entry_date: string;
  product_name: string;
  selling_price: number;
  sku: string;
  image_url: string | null;
  merchant_name: string;
  total_sold: number;
  current_stock: number;
}
