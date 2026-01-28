import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  // if (event.path.startsWith("/api/")) {
  //   const user = await serverSupabaseUser(event);
  //
  //   if (!user) {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: "Unauthorized: Silahkan login terlebih dahulu",
  //     });
  //   }
  //
  //   if (user.user_meta_data.role !== "admin") {
  //     throw createError({
  //       statusCode: 403,
  //       statusMessage: "Forbidden: Admin access required",
  //     });
  //   }
  // }
});
