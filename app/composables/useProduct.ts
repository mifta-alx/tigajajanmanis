import type {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
  MerchantProduct,
} from "~/types/product";
import type { ProductEntity } from "~/types/models";

interface ProductResponse {
  id: string;
  merchant_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  sku: string;
  image_url: string;
  is_active: boolean;
  merchants: { name: string } | null;
  outlet_stocks: {
    stock: number;
    outlets: { name: string } | null;
  }[];
}

interface ProductOutletResponse {
  id: string;
  merchant_id: string;
  name: string;
  selling_price: number;
  sku: string;
  image_url: string;
  merchants: { name: string } | null;
  outlet_stocks: {
    stock: number;
  }[];
}

export const useProduct = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { deleteFile } = useStorage();
  const { uploadImage } = useUploadStorage();

  const createProduct = async (
    payload: Omit<CreateProductDTO, "created_by" | "image_url">,
    imageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    let imageUrl: string | null = null;
    if (imageFile instanceof File) {
      imageUrl = await uploadImage("products", imageFile);
    }

    const insertData: CreateProductDTO = {
      merchant_id: payload.merchant_id,
      name: payload.name,
      cost_price: payload.cost_price,
      selling_price: payload.selling_price,
      image_url: imageUrl,
      created_by: user.value.sub,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(insertData as any)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  };

  const updateProduct = async (
    id: string,
    payload: UpdateProductDTO,
    newImageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    //existing image
    let imageUrl = payload.image_url as string | null;

    if (newImageFile === null) {
      // User removed the logo - delete from storage
      if (payload.image_url) {
        await deleteFile("products", payload.image_url);
      }
      imageUrl = null;
    } else if (newImageFile instanceof File) {
      // User uploaded new logo - delete old one first
      if (payload.image_url) {
        await deleteFile("products", payload.image_url);
      }
      // Upload new logo
      imageUrl = await uploadImage("products", newImageFile);
    }

    const updateData: UpdateProductDTO = {
      merchant_id: payload.merchant_id,
      name: payload.name,
      cost_price: payload.cost_price ?? 0,
      selling_price: payload.selling_price ?? 0,
      image_url: imageUrl,
    };

    const { error } = await (supabase.from("products") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  };

  const deleteProduct = async (id: string) => {
    const { data } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    const product = data as ProductEntity | null;

    const { error: dbError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    if (product?.image_url) {
      await deleteFile("products", product.image_url);
    }
  };

  const toggleStatus = async (productId: string, newStatus: boolean) => {
    const { error: dbError } = await (supabase.from("products") as any)
      .update({ is_active: newStatus })
      .eq("id", productId);

    if (dbError) throw dbError;
  };

  const fetchProducts = async (params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Product[]; total: number }> => {
    const { search, page, limit } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let query = supabase.from("products").select(
      `
      id, 
      merchant_id,
      name, 
      cost_price, 
      selling_price,
      sku,
      image_url, 
      is_active,
      merchants:merchant_id (name),
      outlet_stocks (
        stock,
        outlets:outlet_id (name)
      )
    `,
      {
        count: "exact",
      },
    );

    if (search) {
      query = query.or(`name.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", {
        ascending: true,
      })
      .range(from, to);

    if (error) throw error;

    const rawData = (data as unknown as ProductResponse[]) || [];

    const transformed: Product[] = rawData.map((p) => {
      const { merchants, ...productData } = p;
      return {
        ...productData,
        profit: (p.selling_price || 0) - (p.cost_price || 0),
        merchant_name: merchants?.name ?? "-",
        stock:
          p.outlet_stocks?.reduce(
            (acc: number, curr: any) => acc + curr.stock,
            0,
          ) || 0,
        inventory_details:
          p.outlet_stocks?.map((os: any) => ({
            outlet_name: os.outlets?.name,
            qty: os.stock,
          })) || [],
      };
    });
    return { data: transformed, total: count || 0 };
  };

  const fetchProductByMerchant = async (
    merchantId: string | null | undefined,
    outletId: string | null | undefined,
  ): Promise<MerchantProduct[]> => {
    if (!merchantId) return [];

    const { data, error } = await supabase
      .from("products")
      .select(
        `
      id, 
      merchant_id,
      name, 
      cost_price, 
      selling_price, 
      sku,
      image_url,
      merchants:merchant_id (name),
      outlet_stocks!inner (
        stock,
        outlet_id
      )
    `,
        {
          count: "exact",
        },
      )
      .eq("is_active", true)
      .eq("merchant_id", merchantId as string)
      .eq("outlet_stocks.outlet_id", outletId as string)
      .order("name", { ascending: true });

    if (error) throw error;
    const rawData = (data as unknown as ProductResponse[]) || [];

    const transformed: MerchantProduct[] = rawData.map((m) => {
      const { merchants, ...productData } = m;
      return {
        ...productData,
        merchant_name: merchants?.name ?? "-",
        current_stock: m.outlet_stocks?.[0]?.stock ?? 0,
      };
    });
    return transformed;
  };

  const fetchProductsByOutlet = async (
    outletId: string,
  ): Promise<Omit<MerchantProduct, "cost_price">[]> => {
    if (!outletId) return [];

    // 1. Ambil list merchant_id yang terdaftar di outlet ini
    const { data: connectedMerchants } = await supabase
      .from("outlet_merchants")
      .select("merchant_id")
      .eq("outlet_id", outletId);

    if (!connectedMerchants || connectedMerchants.length === 0) return [];

    const merchantIds = connectedMerchants.map((m: any) => m.merchant_id);

    // 2. Ambil semua produk dari merchant-merchant tersebut + stok di outlet ini
    const { data, error } = await supabase
      .from("products")
      .select(
        `
      id, 
      merchant_id,
      name, 
      selling_price, 
      sku,
      image_url,
      merchants:merchant_id (name),
      outlet_stocks!inner (
        stock
      )
    `,
      )
      .in("merchant_id", merchantIds)
      .eq("outlet_stocks.outlet_id", outletId)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;

    return (data as ProductOutletResponse[]).map((p) => ({
      id: p.id,
      merchant_id: p.merchant_id,
      name: p.name,
      sku: p.sku,
      image_url: p.image_url,
      selling_price: p.selling_price,
      merchant_name: p.merchants?.name ?? "-",
      current_stock: p.outlet_stocks?.[0]?.stock || 0,
    }));
  };

  return {
    fetchProducts,
    fetchProductByMerchant,
    fetchProductsByOutlet,
    toggleStatus,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
