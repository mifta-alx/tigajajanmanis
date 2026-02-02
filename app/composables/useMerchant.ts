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
    payload: Omit<CreateMerchantDTO, "created_by" | "logo_url">,
    logoFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    let logoUrl: string | null = null;
    if (logoFile instanceof File) {
      logoUrl = await uploadImage("merchants", logoFile);
    }

    const insertData: CreateMerchantDTO = {
      name: payload.name,
      phone_number: payload.phone_number,
      address: payload.address,
      logo_url: logoUrl,
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
    newLogoFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    //existing image
    let logoUrl = payload.logo_url as string | null;

    if (newLogoFile === null) {
      // User removed the logo - delete from storage
      if (payload.logo_url) {
        await deleteFile("merchants", payload.logo_url);
      }
      logoUrl = null;
    } else if (newLogoFile instanceof File) {
      // User uploaded new logo - delete old one first
      if (payload.logo_url) {
        await deleteFile("merchants", payload.logo_url);
      }
      // Upload new logo
      logoUrl = await uploadImage("merchants", newLogoFile);
    }

    const updateData: UpdateMerchantDTO = {
      name: payload.name,
      phone_number: payload.phone_number,
      address: payload.address,
      logo_url: logoUrl,
    };

    const { error } = await (supabase.from("merchants") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  };

  const deleteMerchant = async (id: string) => {
    const { data } = await supabase
      .from("merchants")
      .select("logo_url")
      .eq("id", id)
      .single();

    const merchant = data as MerchantEntity | null;

    const { error: dbError } = await supabase
      .from("merchants")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    if (merchant?.logo_url) {
      await deleteFile("merchants", merchant.logo_url);
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
      logo_url, 
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
