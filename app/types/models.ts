import type { Role } from "~/types/role";

export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  address: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
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
