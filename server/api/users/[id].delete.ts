import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "id");
  const config = useRuntimeConfig();

  if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Supabase environment variables",
    });
  }
  const supabaseAdmin = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  );

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID user tidak ditemukan",
    });
  }

  // 3. Hapus user dari Auth
  // Karena sudah ada ON DELETE CASCADE, tabel profiles akan otomatis terhapus
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal menghapus user: " + error.message,
    });
  }

  return { message: "User dan Profil berhasil dihapus" };
});
