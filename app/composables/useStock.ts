import type {
  CreateStockDTO,
  SettlementGroupedItem,
  SettlementProduct,
  Stock,
  StockLogRaw,
  UpdateStockDTO,
} from "~/types/stock";
import type { StockLogType } from "~/types/models";

interface StockResponse {
  id: string;
  merchant_id: string;
  product_id: string;
  outlet_id: string;
  quantity: number;
  entry_date: string;
  type: StockLogType;
  created_at: string;
  profiles: { fullname: string } | null;
  merchants: { name: string } | null;
  outlets: { name: string } | null;
  products: { name: string; sku: string; image_url: string } | null;
}

export const useStock = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const addBulkStock = async (items: Omit<CreateStockDTO, "created_by">[]) => {
    if (!user.value) throw new Error("User not authenticated");

    const payload: CreateStockDTO[] = items.map((item) => ({
      ...item,
      created_by: user.value!.sub,
    }));

    const { data, error } = await supabase
      .from("stock_logs")
      .insert(payload as any);

    if (error) throw error;

    return data;
  };

  const updateStockLog = async (id: string, payload: UpdateStockDTO) => {
    const { error } = await (supabase.from("stock_logs") as any)
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  };

  const deleteStockLog = async (id: string) => {
    const { error: dbError } = await supabase
      .from("stock_logs")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;
  };

  const settleProduct = async (item: Stock) => {
    if (!user.value) throw new Error("User not authenticated");

    const payload: CreateStockDTO = {
      product_id: item.product_id,
      outlet_id: item.outlet_id,
      merchant_id: item.merchant_id,
      entry_date: item.entry_date,
      quantity: item.current_stock ?? 0,
      type: "OUT_SETTLE",
      created_by: user.value!.sub,
    };

    const { error } = await supabase.from("stock_logs").insert(payload as any);

    if (error) throw error;
  };

  const fetchStock = async (
    params: {
      filterDate?: string;
      search?: string;
      isGrouped?: boolean;
      type?: StockLogType;
      outletId?: string;
    } = {},
  ) => {
    const {
      filterDate,
      search,
      isGrouped = false,
      type = "ALL",
      outletId,
    } = params;
    let query = supabase.from("stock_logs").select(
      `
      id, 
      merchant_id,
      product_id,
      outlet_id,
      quantity,
      entry_date,
      type,
      created_at,
      profiles:created_by (fullname),
      products:product_id (name, sku, image_url),
      merchants:merchant_id (name),
      outlets:outlet_id (name)
      `,
      {
        count: "exact",
      },
    );
    if (type && type !== "ALL") {
      query = query.eq("type", type);
    }

    if (filterDate) {
      const cleanDate = filterDate.includes("T")
        ? filterDate.split("T")[0]
        : filterDate;
      query = query.eq("entry_date", cleanDate as string);
    }

    if (search) {
      query = query.ilike("products.name", `%${search}%`);
    }

    if (outletId) {
      query = query.eq("outlet_id", outletId);
    }

    const { data, error, count } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    const rawData = (data as unknown as StockResponse[]) || [];

    const transformed: Stock[] = rawData.map((s) => {
      const { profiles, merchants, outlets, products, ...stockData } = s;
      return {
        ...stockData,
        merchant_name: merchants?.name ?? "Unknown Merchant",
        outlet_name: outlets?.name ?? "Unknown Outlet",
        product_name: products?.name ?? "Unknown Product",
        creator_name: profiles?.fullname ?? "System",
        sku: products?.sku ?? "-",
        image_url: products?.image_url ?? null,
      };
    });

    if (isGrouped) {
      const grouped = transformed.reduce((acc, curr) => {
        const existing = acc.find(
          (item) =>
            String(item.product_id) === String(curr.product_id) &&
            String(item.outlet_id) === String(curr.outlet_id),
        );

        if (existing) {
          if (curr.type === "IN") existing.total_in += curr.quantity;
          if (curr.type === "OUT_SOLD") existing.total_sold += curr.quantity;
          if (curr.type === "OUT_SETTLE")
            existing.total_settle += curr.quantity;

          existing.current_stock =
            existing.total_in - existing.total_sold - existing.total_settle;
        } else {
          acc.push({
            ...curr,
            total_in: curr.type === "IN" ? curr.quantity : 0,
            total_sold: curr.type === "OUT_SOLD" ? curr.quantity : 0,
            total_settle: curr.type === "OUT_SETTLE" ? curr.quantity : 0,
            current_stock: curr.type === "IN" ? curr.quantity : -curr.quantity,
          });
        }
        return acc;
      }, [] as any[]);

      return { data: grouped, total: grouped.length };
    }

    return { data: transformed, total: count || 0 };
  };

  const checkExistingStock = async (outletId: string, merchantId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { data: currentBalances } = await supabase
      .from("outlet_stocks")
      .select(
        `
      stock,
      products!inner(merchant_id, merchants(name))
    `,
      )
      .eq("outlet_id", outletId)
      .eq("products.merchant_id", merchantId)
      .gt("stock", 0);

    const merchantName =
      (currentBalances as any)?.[0]?.products?.merchants?.name || null;

    const hasPhysicalStock = currentBalances && currentBalances.length > 0;

    if (!hasPhysicalStock) {
      return { hasStock: false };
    }

    const { data: inputToday } = await supabase
      .from("stock_logs")
      .select("id")
      .eq("outlet_id", outletId)
      .eq("merchant_id", merchantId)
      .eq("type", "IN")
      .gte("entry_date", today)
      .limit(1);

    const alreadyInputToday = inputToday && inputToday.length > 0;

    return {
      hasStock: hasPhysicalStock && !alreadyInputToday,
      merchantName,
      error: null,
    };
  };

  const fetchSettlementWorklist = async (params: {
    outletId: string;
    merchantId: string;
  }): Promise<{ data: SettlementProduct[]; total: number }> => {
    const { outletId, merchantId } = params;

    if (!outletId || !merchantId) return { data: [], total: 0 };

    // 1. Cari kapan terakhir kali Sesi benar-benar ditutup (OUT_SETTLE)
    const { data } = await supabase
      .from("stock_logs")
      .select("entry_date")
      .eq("outlet_id", outletId)
      .eq("merchant_id", merchantId)
      .eq("type", "OUT_SETTLE")
      .order("entry_date", { ascending: false })
      .limit(1)
      .maybeSingle();
    // 2. Tarik data logs
    let query = supabase
      .from("stock_logs")
      .select(
        `
      product_id,
      quantity,
      type,
      entry_date,
      products:product_id (name, sku, image_url, selling_price),
      merchants:merchant_id (name)
    `,
      )
      .eq("outlet_id", outletId)
      .eq("merchant_id", merchantId);

    // 2. Tarik log mulai dari tanggal terakhir titip
    const lastSettle = data as { entry_date: string } | null;
    if (lastSettle?.entry_date) {
      query = query.gt("entry_date", lastSettle.entry_date);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    const rawData = (logs as unknown as StockLogRaw[]) || [];

    // 3. Kalkulasi sisa stok & simpan total_sold
    const grouped = rawData.reduce(
      (acc, curr) => {
        const pId = curr.product_id;

        if (!acc[pId]) {
          acc[pId] = {
            product_id: pId,
            entry_date: curr.entry_date,
            product_name: curr.products?.name ?? "Unknown",
            selling_price: curr.products?.selling_price ?? 0,
            sku: curr.products?.sku ?? "-",
            image_url: curr.products?.image_url,
            merchant_name: curr.merchants?.name ?? "-",
            total_sold: 0, // Ini tetap dijaga
            _total_in: 0, // Pakai underscore buat penanda bakal dibuang
            _total_settle: 0,
            current_stock: 0,
          };
        }

        if (curr.type === "IN") {
          acc[pId]._total_in += curr.quantity;
        } else if (curr.type === "OUT_SOLD") {
          acc[pId].total_sold += curr.quantity;
        } else if (curr.type === "OUT_SETTLE") {
          acc[pId]._total_settle += curr.quantity;
        }

        // Rumus saldo akhir tetap sama
        acc[pId].current_stock =
          acc[pId]._total_in - acc[pId].total_sold - acc[pId]._total_settle;

        return acc;
      },
      {} as Record<string, SettlementGroupedItem>,
    );

    // 4. Filter stok > 0 & Buang yang gak disuruh tampil (in & settle)
    const finalData: SettlementProduct[] = Object.values(grouped)
      .filter((item: any) => item.current_stock > 0)
      .map(({ _total_in, _total_settle, ...rest }) => rest);

    return {
      data: finalData,
      total: finalData.length,
    };
  };

  return {
    fetchStock,
    addBulkStock,
    settleProduct,
    updateStockLog,
    deleteStockLog,
    checkExistingStock,
    fetchSettlementWorklist,
  };
};
