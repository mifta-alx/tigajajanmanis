import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const { bucket, fileName } = await readBody(event);
  const config = useRuntimeConfig();

  if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Supabase environment variables",
    });
  }
  const allowedBuckets = ["merchants", "products"];
  if (!allowedBuckets.includes(bucket)) {
    throw createError({
      statusCode: 403,
      message: "Invalid bucket",
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

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
  return { success: true, data };
});
