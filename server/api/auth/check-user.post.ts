import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const { username } = await readBody(event);
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

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  return { exists: !!data };
});
