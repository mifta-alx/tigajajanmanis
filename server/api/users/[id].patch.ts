import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const { status } = body;

  if (!id || id === "undefined" || id === "[id]") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid User ID",
    });
  }

  if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Supabase environment variables",
    });
  }

  const supabaseAdmin = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      {
        app_metadata: { status: status },
      },
    );

    if (authError) throw authError;

    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .update({ status: status })
      .eq("id", id);

    if (dbError) throw dbError;

    return { success: true, message: "User status updated successfully" };
  } catch (error: any) {
    console.error("Update Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
