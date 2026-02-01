import { convertToWebP } from "~/lib/utils";

export const useUploadStorage = () => {
  const uploadImage = async (storageName: string, file: File) => {
    const supabase = useSupabaseClient();
    const webpBlob = await convertToWebP(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;

    const { data, error: uploadError } = await supabase.storage
      .from(storageName)
      .upload(fileName, webpBlob, { contentType: "image/webp" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(storageName).getPublicUrl(fileName);

    return publicUrl;
  };

  return { uploadImage };
};
