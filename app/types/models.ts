import type { Role } from "~/types/role";

export interface Profile {
  id: string;
  username: string;
  fullname: string;
  phone_number: string;
  address: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MerchantEntity {
  id: string;
  name: string;
  phone_number: string;
  address: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductEntity {
  id: string;
  merchant_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  created_by: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
}

export interface StockEntity {
  id: string;
  merchant_id: string;
  product_id: string;
  quantity: number;
  entry_date: string;
  notes: string;
  created_by: string;
  creator_name: string;
  created_at: string;
  updated_at: string;
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
