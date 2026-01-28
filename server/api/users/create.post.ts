import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
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

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: `${body.username}@tigajajanmanis.com`,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      username: body.username,
      fullname: body.fullName,
      phone_number: body.phoneNumber,
      address: body.address,
      role: body.role,
    },
  });

  if (error) throw error;
  return data;
});
