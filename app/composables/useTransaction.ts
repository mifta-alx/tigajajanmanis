import type { TransactionResponse } from "~/types/transaction";

interface SummaryTrx {
  created_at: string;
  total_price: number;
  transaction_items: {
    quantity: number;
    cost_price_at_time: number;
    selling_price_at_time: number;
  }[];
}

export const useTransaction = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const isSubmitting = ref(false);

  const createTransaction = async (payload: {
    cashReceived: number;
    stockInput: Record<string, number>;
    paymentType: string;
  }): Promise<TransactionResponse> => {
    // 1. Validasi awal di client
    const items = Object.entries(payload.stockInput)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        product_id: id,
        quantity: qty,
      }));

    if (items.length === 0) throw new Error("Keranjang kosong");

    const outletId = user.value?.user_metadata?.outlet_id;
    if (!outletId) throw new Error("Data outlet tidak ditemukan");

    isSubmitting.value = true;

    try {
      // 2. Panggil RPC Supabase
      const { data, error } = await (supabase as any).rpc(
        "process_transaction",
        {
          p_outlet_id: outletId,
          p_cashier_id: user.value?.sub,
          p_cash_received: payload.cashReceived,
          p_payment_type: payload.paymentType,
          p_items: items,
        },
      );

      if (error) throw error;

      return data;
    } catch (err: any) {
      console.error("Transaction failed:", err.message);
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  const fetchTransactions = async (params: {
    date: string;
    outletId?: string;
  }) => {
    const startDate = new Date(`${params.date}T00:00:00`);
    const endDate = new Date(`${params.date}T23:59:59`);
    try {
      let query = supabase
        .from("transactions")
        .select(
          `
          id,
          cash_change,
          cash_received,
          created_at,
          invoice_number,
          outlet_id,
          payment_type,
          queue_number,
          status,
          total_items,
          total_price,
          outlets (name),
          transaction_items (
            quantity,
            cost_price_at_time,
            selling_price_at_time,
            subtotal
          )
        `,
        )
        .eq("status", "COMPLETED")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      if (params.outletId) {
        query = query.eq("outlet_id", params.outletId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error("Fetch transactions failed:", err.message);
      return [];
    }
  };

  const getTransactionSummary = async (params: {
    date: string;
    outletId?: string;
  }) => {
    const today = new Date(params.date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = new Date(
      `${yesterday.toISOString().split("T")[0]}T00:00:00`,
    );
    const endDate = new Date(`${params.date}T23:59:59`);

    let query = supabase
      .from("transactions")
      .select(
        `
      id, created_at, total_price,
      transaction_items (quantity, cost_price_at_time, selling_price_at_time)
    `,
      )
      .eq("status", "COMPLETED")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (params.outletId) query = query.eq("outlet_id", params.outletId);

    const { data: allData, error } = await query;
    if (error)
      return {
        revenue: 0,
        profit: 0,
        count: 0,
        comparison: { percentage: 0, trend: "stagnant" },
      };

    // 3. Pisahkan data Hari Ini dan Kemarin di level JavaScript
    const todayStr = params.date;

    const allDataTyped = allData as unknown as SummaryTrx[];
    const todayTrx =
      allDataTyped?.filter((trx) => trx.created_at.startsWith(todayStr)) || [];
    const yesterdayTrx =
      allDataTyped?.filter((trx) => !trx.created_at.startsWith(todayStr)) || [];

    // Helper hitung total (Sama seperti tadi)
    const calculateData = (list: any[]) => {
      let revenue = 0;
      let profit = 0;
      list.forEach((trx) => {
        revenue += Number(trx.total_price);
        trx.transaction_items?.forEach((item: any) => {
          profit +=
            (item.selling_price_at_time - item.cost_price_at_time) *
            item.quantity;
        });
      });
      return { revenue, profit };
    };

    const current = calculateData(todayTrx);
    const prev = calculateData(yesterdayTrx);

    // 4. Hitung Persentase (Logika tetap sama)
    let diffPercentage = 0;
    if (prev.revenue > 0) {
      diffPercentage = ((current.revenue - prev.revenue) / prev.revenue) * 100;
    } else if (current.revenue > 0) {
      diffPercentage = 100;
    }

    return {
      revenue: current.revenue,
      profit: current.profit,
      count: todayTrx.length,
      comparison: {
        percentage: Math.abs(Number(diffPercentage.toFixed(2))),
        trend:
          diffPercentage > 0 ? "up" : diffPercentage < 0 ? "down" : "stagnant",
      },
    };
  };

  const getTransactionById = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          cashier_id,
          cash_change,
          cash_received,
          created_at,
          invoice_number,
          outlet_id,
          payment_type,
          queue_number,
          status,
          total_items,
          total_price,
          cashier_id,
          profiles (
            fullname
          ),
          outlets (name),
          transaction_items (
            quantity,
            cost_price_at_time,
            selling_price_at_time,
            subtotal,
            products (
              name
            )
          )
        `,
        )
        .eq("id", transactionId)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error("Fetch transaction detail failed:", err.message);
      return null;
    }
  };
  return {
    createTransaction,
    isSubmitting,
    fetchTransactions,
    getTransactionSummary,
    getTransactionById,
  };
};
