import type {
  PaymentMethodType,
  TransactionEntity,
  TransactionStatusType,
} from "~/types/models";

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

export interface TransactionDetail {
  id: string;
  cashier_id: string;
  cash_change: number;
  cash_received: number;
  created_at: string;
  invoice_number: string;
  outlet_id: string;
  payment_type: PaymentMethodType;
  queue_number: string;
  status: TransactionStatusType;
  total_items: number;
  total_price: number;
  outlets: { name: string };
  profiles: { fullname: string };
  transaction_items: Array<{
    quantity: number;
    cost_price_at_time: number;
    selling_price_at_time: number;
    subtotal: number;
    products: {
      name: string;
      image_url: string | null;
      merchants: { name: string };
    };
  }>;
}

export const PaymentMethodString: Record<string, string> = {
  CASH: "Tunai",
  DEBIT: "Debit",
  QRIS: "QRIS Statis",
  TRANSFER: "Transfer",
};

export const TransactionStatusConfig = {
  COMPLETED: {
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    lightBg: "bg-emerald-500/10",
    icon: "lucide:check",
    label: "Berhasil",
  },
  PENDING: {
    color: "text-amber-500",
    bg: "bg-amber-500",
    lightBg: "bg-amber-500/10",
    icon: "lucide:clock",
    label: "Pending",
  },
  CANCELLED: {
    color: "text-red-500",
    bg: "bg-red-500",
    lightBg: "bg-red-500/10",
    icon: "lucide:x",
    label: "Dibatalkan",
  },
  REFUNDED: {
    color: "text-blue-500",
    bg: "bg-blue-500",
    lightBg: "bg-blue-500/10",
    icon: "lucide:rotate-ccw",
    label: "Dikembalikan",
  },
};
