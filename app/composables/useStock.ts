import type { CreateStockDTO, Stock, UpdateStockDTO } from "~/types/stock";
import type { StockLogType } from "~/types/models";

interface StockResponse {
  id: string;
  merchant_id: string;
  product_id: string;
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

  const fetchStock = async (
    params: {
      filterDate?: string;
      search?: string;
      isGrouped?: boolean;
      type?: StockLogType;
    } = {},
  ) => {
    const { filterDate, search, isGrouped = false, type = "IN" } = params;
    let query = supabase.from("stock_logs").select(
      `
      id, 
      merchant_id,
      product_id,
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

    if (type) {
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

    const { data, error, count } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    const rawData = (data as unknown as StockResponse[]) || [];

    const transformed: Stock[] = rawData.map((m) => {
      const { ...stockData } = m;
      return {
        ...stockData,
        merchant_name: m.merchants?.name ?? "Unknown Merchant",
        outlet_name: m.outlets?.name ?? "Unknown Outlet",
        product_name: m.products?.name ?? "Unknown Product",
        creator_name: m.profiles?.fullname ?? "System",
        sku: m.products?.sku ?? "-",
        image_url: m.products?.image_url ?? null,
      };
    });

    if (isGrouped) {
      const grouped = transformed.reduce((acc, curr) => {
        const existing = acc.find(
          (item) => item.product_id === curr.product_id,
        );
        if (existing) {
          existing.quantity += curr.quantity;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, [] as Stock[]);

      return { data: grouped, total: grouped.length };
    }
    return { data: transformed, total: count || 0 };
  };

  return { fetchStock, addBulkStock, updateStockLog, deleteStockLog };
};
