export const useStorage = () => {
  const deleteFile = async (bucket: string, fileUrl: string) => {
    if (!fileUrl || !fileUrl.includes("supabase.co")) return;

    const fileName = fileUrl.split("/").pop();
    if (!fileName) return;

    try {
      await $fetch("/api/storage/delete", {
        method: "POST",
        body: { bucket, fileName },
      });
    } catch (err) {
      console.error("Failed to delete file from storage:", err);
      throw err;
    }
  };

  return {
    deleteFile,
  };
};
