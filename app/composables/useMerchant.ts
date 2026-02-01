import type {
  CreateMerchantDTO,
  MerchantWithProfile,
  UpdateMerchantDTO,
} from "~/types/merchant";
import { convertToWebP } from "~/lib/utils";
import type { Merchant } from "~/types/models";

interface MerchantResponse {
  id: string;
  name: string;
  phone_number: string;
  address: string;
  logo_url: string;
  is_active: boolean;
  profiles: { fullname: string } | null;
}

export const useMerchant = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const { deleteFile } = useStorage();

  const uploadLogo = async (file: File) => {
    const webpBlob = await convertToWebP(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

    const { data, error: uploadError } = await supabase.storage
      .from("merchants")
      .upload(fileName, webpBlob, { contentType: "image/webp" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("merchants").getPublicUrl(fileName);

    return publicUrl;
  };

  const createMerchant = async (
    payload: Omit<
      CreateMerchantDTO,
      "id" | "created_at" | "updated_at" | "created_by" | "is_active"
    >,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    const insertData: CreateMerchantDTO = {
      name: payload.name,
      phone_number: payload.phone_number,
      address: payload.address,
      logo_url: payload.logo_url,
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
      logoUrl = await uploadLogo(newLogoFile);
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

    const merchant = data as Merchant | null;

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
  }): Promise<{ data: MerchantWithProfile[]; total: number }> => {
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
      profiles:created_by (fullname)
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

    const transformed: MerchantWithProfile[] = rawData.map((m) => {
      const { profiles, ...merchantData } = m;
      return {
        ...merchantData,
        creator_name: profiles?.fullname ?? "Unknown",
      };
    });
    return { data: transformed, total: count || 0 };
  };

  return {
    fetchMerchants,
    uploadLogo,
    toggleStatus,
    createMerchant,
    updateMerchant,
    deleteMerchant,
  };
};
