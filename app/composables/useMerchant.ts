import type { MerchantRow } from "~/types/database";
import type { Merchant } from "~/types/models";
import type { Database } from "~/types/database.types";
import { convertToWebP } from "~/lib/utils";

type MerchantInsert = Database["public"]["Tables"]["merchants"]["Insert"];
type MerchantUpdate = Database["public"]["Tables"]["merchants"]["Update"];

export const useMerchant = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const { deleteFile } = useStorage();

  const transformUser = (row: MerchantRow): Merchant => ({
    id: row.id,
    name: row.name,
    phoneNumber: row.phone_number,
    address: row.address,
    logoUrl: row.logo_url,
    isActive: row.is_active,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

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
      Merchant,
      "id" | "createdAt" | "updatedAt" | "createdBy" | "isActive"
    >,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    const insertData: MerchantInsert = {
      name: payload.name,
      phone_number: payload.phoneNumber,
      address: payload.address,
      logo_url: payload.logoUrl,
      created_by: user.value.sub,
    };

    const { data, error } = await supabase
      .from("merchants")
      .insert(insertData as any)
      .select()
      .single();

    if (error) throw error;
    return transformUser(data as any);
  };

  const updateMerchant = async (
    id: string,
    payload: Partial<Merchant>,
    newLogoFile?: File | null,
  ) => {
    if (!user.value) throw new Error("User not authenticated");

    //existing image
    let logoUrl = payload.logoUrl as string | null;

    if (newLogoFile === null) {
      // User removed the logo - delete from storage
      if (payload.logoUrl) {
        await deleteFile("merchants", payload.logoUrl);
      }
      logoUrl = null;
    } else if (newLogoFile instanceof File) {
      // User uploaded new logo - delete old one first
      if (payload.logoUrl) {
        await deleteFile("merchants", payload.logoUrl);
      }
      // Upload new logo
      logoUrl = await uploadLogo(newLogoFile);
    }

    const updateData: MerchantUpdate = {
      name: payload.name,
      phone_number: payload.phoneNumber,
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

    const merchant = data as MerchantRow | null;

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

  const fetchMerchants = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ? data.map(transformUser) : [];
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
