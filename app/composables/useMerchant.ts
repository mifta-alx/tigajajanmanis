import type {
  CreateMerchantDTO,
  Merchant,
  UpdateMerchantDTO,
} from "~/types/merchant";
import type { MerchantEntity } from "~/types/models";

interface SimpleMerchants {
  id: string;
  name: string;
}

export const useMerchant = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { deleteFile } = useStorage();
  const { uploadImage } = useUploadStorage();

  const createMerchant = async (
    payload: Omit<CreateMerchantDTO, "created_by" | "image_url">,
    imageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    let imageUrl: string | null = null;
    if (imageFile instanceof File) {
      imageUrl = await uploadImage("merchants", imageFile);
    }

    const insertData: CreateMerchantDTO = {
      name: payload.name,
      phone_number: payload.phone_number,
      address: payload.address,
      image_url: imageUrl,
      created_by: user.value.sub,
    };

    const { data, error } = await supabase
      .from("merchants")
      .insert(insertData as any)
      .select()
      .single();

    if (error) throw error;
    return data as Merchant;
  };

  const updateMerchant = async (
    id: string,
    payload: UpdateMerchantDTO,
    newImageFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

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

    const { error } = await (supabase.from("merchants") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
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
    page: number;
    limit: number;
  }): Promise<{ data: Merchant[]; total: number }> => {
    const { search, page, limit } = params;

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
      creator_name
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

    return { data, total: count || 0 };
  };

  const fetchSimpleMerchants = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .select("id, name")
      .order("created_at", {
        ascending: true,
      });

    if (error) throw error;

    return (data as SimpleMerchants[]) ?? [];
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
