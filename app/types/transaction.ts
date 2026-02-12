import type { TransactionEntity } from "~/types/models";

export interface TransactionResponse {
  status: string;
  invoice: string;
  queue_number: string;
  total: number;
}

export interface TransactionWithItems extends TransactionEntity {
  transaction_items: {
    quantity: number;
    cost_price_at_time: number;
    selling_price_at_time: number;
    subtotal: number;
  }[];
}
