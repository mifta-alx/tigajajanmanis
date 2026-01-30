import type { Role } from "~/types/role";

export interface UserRow {
  id: string;
  username: string;
  fullname: string;
  phone_number: string;
  address: string | null;
  role: Role;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface MerchantRow {
  id: string;
  name: string;
  phone_number: string;
  address: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
