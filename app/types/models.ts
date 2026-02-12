import type { Role } from "~/types/role";
export type StockLogType =
  | "ALL"
  | "IN"
  | "OUT_SOLD"
  | "OUT_SETTLE"
  | "ADJUSTMENT";

export type TransactionStatusType =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentMethodType = "CASH" | "DEBIT" | "QRIS" | "TRANSFER";

export interface ProfileEntity {
  id: string;
  username: string;
  fullname: string;
  phone_number: string;
  address: string | null;
  role: Role;
  is_active: boolean;
  outlet_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MerchantEntity {
  id: string;
  name: string;
  phone_number: string | null;
  address: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductEntity {
  id: string;
  merchant_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface StockEntity {
  id: string;
  merchant_id: string;
  outlet_id: string;
  product_id: string;
  quantity: number;
  entry_date: string;
  type: StockLogType;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OutletEntity {
  id: string;
  name: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionEntity {
  id: string;
  outlet_id: string;
  cashier_id: string;
  invoice_number: string;
  queue_number: string;
  total_price: number;
  total_items: number;
  cash_received: number;
  cash_change: number;
  payment_method: PaymentMethodType;
  status: TransactionStatusType;
  created_at: string;
  updated_at: string;
}

export interface TransactionItemEntity {
  id: string;
  transaction_id: string;
  product_id: string;
  merchant_id: string;
  quantity: number;
  cost_price_at_time: number;
  selling_price_at_time: number;
  subtotal: number;
  created_at: string;
}

export interface DrawerState {
  isOpen: boolean;
  icon?: string;
  type: string;
  title: string;
  description?: string;
  component?: any;
  props?: Record<string, any>;
  outsideClick: boolean;
}

export interface AuthErrorResponse {
  title: string;
  description: string;
}

export interface Toast {
  id: number;
  title: string;
  description?: string;
  type: "success" | "error" | "warning" | "info" | "default";
}
