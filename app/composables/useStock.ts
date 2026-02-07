import type { CreateStockDTO, Stock, UpdateStockDTO } from "~/types/stock";
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

  return {
    fetchStock,
    addBulkStock,
    settleProduct,
    updateStockLog,
    deleteStockLog,
  };
};
