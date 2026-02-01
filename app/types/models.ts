import type { Role } from "~/types/role";

export interface Profile {
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

export interface Merchant {
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
