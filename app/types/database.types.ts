export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string;
          name: string;
          phone_number: string | null;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone_number?: string | null;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone_number?: string | null;
          address?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          price_buy: number;
          margin: number;
          price_sell: number;
          initial_stock: number;
          current_stock: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          price_buy: number;
          margin: number;
          price_sell: number;
          initial_stock?: number;
          current_stock?: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          price_buy?: number;
          margin?: number;
          price_sell?: number;
          initial_stock?: number;
          current_stock?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          fullname: string;
          phone_number: string;
          address: string | null;
          role: "admin" | "staff";
          status: 0 | 1;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          fullname?: string;
          phone_number?: string;
          address: string | null;
          role?: "admin" | "staff";
          status: 0 | 1;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          fullname?: string;
          phone_number?: string;
          address: string | null;
          role?: "admin" | "staff";
          status: 0 | 1;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
