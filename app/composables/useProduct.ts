import type {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
} from "~/types/product";
import type { ProductEntity } from "~/types/models";
import { formatPrice } from "~/lib/utils";

interface ProductResponse {
  id: string;
  merchant_id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  stock: number;
  sku: string;
  image_url: string;
  is_active: boolean;
  creator_name: string;
  merchants: { name: string } | null;
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
      stock, 
      sku,
      image_url, 
      is_active,
      creator_name,
      merchants:merchant_id (name)
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

    const transformed: Product[] = rawData.map((m) => {
      const { merchants, cost_price, selling_price, ...productData } = m;
      return {
        ...productData,
        selling_price,
        cost_price,
        profit: (selling_price || 0) - (cost_price || 0),
        merchant_name: merchants?.name ?? "System",
      };
    });
    return { data: transformed, total: count || 0 };
  };

  return {
    fetchProducts,
    toggleStatus,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
