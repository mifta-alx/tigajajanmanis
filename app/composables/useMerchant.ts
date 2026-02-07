import type {
  CreateMerchantDTO,
  Merchant,
  MerchantInput,
  SimpleMerchants,
  UpdateMerchantDTO,
} from "~/types/merchant";
import type { MerchantEntity } from "~/types/models";

interface MerchantResponse {
  id: string;
  name: string;
  phone_number: string | null;
  address: string | null;
  image_url: string;
  is_active: boolean;
  profiles: { fullname: string } | null;
  outlet_merchants: {
    outlet_id: string;
    outlets: { name: string } | null;
  }[];
}

export const useMerchant = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { deleteFile } = useStorage();
  const { uploadImage } = useUploadStorage();

  const createMerchant = async (
    payload: MerchantInput,
    imageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");
    const { outlet_ids, ...merchantData } = payload;

    let imageUrl: string | null = null;
    if (imageFile instanceof File) {
      imageUrl = await uploadImage("merchants", imageFile);
    }

    const insertData: CreateMerchantDTO = {
      ...merchantData,
      image_url: imageUrl,
      created_by: user.value.sub,
    };

    const { data: newMerchant, error: merchantError } = await supabase
      .from("merchants")
      .insert(insertData as any)
      .select()
      .single();

    if (merchantError) throw merchantError;

    const merchantId = (newMerchant as MerchantEntity).id;

    if (outlet_ids && outlet_ids.length > 0) {
      const relations = outlet_ids.map((outletId: string) => ({
        merchant_id: merchantId,
        outlet_id: outletId,
      }));

      const { error: relErr } = await supabase
        .from("outlet_merchants")
        .insert(relations as any);

      if (relErr) throw relErr;
    }
    return newMerchant as Merchant;
  };

  const updateMerchant = async (
    id: string,
    payload: UpdateMerchantDTO,
    newImageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    const { outlet_ids, ...merchantData } = payload;
    //existing image
    let imageUrl = payload.image_url as string | null;

    if (newImageFile === null) {
      // User removed the logo - delete from storage
      if (payload.image_url) {
        await deleteFile("merchants", payload.image_url);
      }
      imageUrl = null;
    } else if (newImageFile instanceof File) {
      // User uploaded new logo - delete old one first
      if (payload.image_url) {
        await deleteFile("merchants", payload.image_url);
      }
      // Upload new logo
      imageUrl = await uploadImage("merchants", newImageFile);
    }

    const updateData: UpdateMerchantDTO = {
      name: payload.name,
      phone_number: payload.phone_number,
      address: payload.address,
      image_url: imageUrl,
    };

    const { error: dbError } = await (supabase.from("merchants") as any)
      .update(updateData)
      .eq("id", id);

    if (dbError) throw dbError;

    if (outlet_ids) {
      await supabase.from("outlet_merchants").delete().eq("merchant_id", id);

      if (outlet_ids.length > 0) {
        const relations = outlet_ids.map((outletId) => ({
          merchant_id: id,
          outlet_id: outletId,
        }));

        const { error: relErr } = await supabase
          .from("outlet_merchants")
          .insert(relations as any);

        if (relErr) throw relErr;
      }
    }
  };

  const deleteMerchant = async (id: string) => {
    const { data } = await supabase
      .from("merchants")
      .select("image_url")
      .eq("id", id)
      .single();

    const merchant = data as MerchantEntity | null;

    const { error: dbError } = await supabase
      .from("merchants")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    if (merchant?.image_url) {
      await deleteFile("merchants", merchant.image_url);
    }
  };

  const toggleStatus = async (merchantId: string, newStatus: boolean) => {
    const { error: dbError } = await (supabase.from("merchants") as any)
      .update({ is_active: newStatus })
      .eq("id", merchantId);

    if (dbError) throw dbError;
  };

  const fetchMerchants = async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Merchant[]; total: number }> => {
    const { search, page = 1, limit = 1000 } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("merchants").select(
      `
      id, 
      name, 
      phone_number, 
      address, 
      image_url, 
      is_active,
      profiles:created_by (fullname),
      outlet_merchants (outlet_id,
      outlets:outlet_id (name))
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

    const rawData = (data as unknown as MerchantResponse[]) || [];

    const transformed: Merchant[] = rawData.map((m) => {
      const { profiles, outlet_merchants, ...merchantData } = m;
      return {
        ...merchantData,
        creator_name: profiles?.fullname ?? "Unknown",
        outlet_merchants: outlet_merchants || [],
      };
    });
    return { data: transformed, total: count || 0 };
  };

  const fetchSimpleMerchants = async (
    isActive: boolean = false,
    outletId?: string,
  ) => {
    let query = supabase
      .from("merchants")
      .select(
        `id, name, image_url, products:products(count), 
        outlet_merchants!inner (
        outlet_id,
        outlets:outlet_id (name)
      )`,
      )
      .filter("products.is_active", "eq", true);

    if (isActive) {
      query = query.eq("is_active", isActive);
    }

    if (outletId) {
      query = query.eq("outlet_merchants.outlet_id", outletId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: true,
    });

    if (error) throw error;

    return (data?.map((merchant: any) => ({
      id: merchant.id,
      name: merchant.name,
      image_url: merchant.image_url,
      product_count: merchant.products?.[0]?.count || 0,
      outlets:
        merchant.outlet_merchants?.map((om: any) => ({
          id: om.outlet_id,
          name: om.outlets?.name,
        })) || [],
    })) || []) as SimpleMerchants[];
  };

  return {
    fetchMerchants,
    fetchSimpleMerchants,
    toggleStatus,
    createMerchant,
    updateMerchant,
    deleteMerchant,
  };
};
