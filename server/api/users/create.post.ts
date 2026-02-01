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
      fullname: body.fullname,
      phone_number: body.phone_number,
      address: body.address,
      role: body.role,
    },
  });

  if (error) {
    if (error.status === 422) {
      throw createError({
        statusCode: error.status,
        statusMessage: "Username has already been registered",
      });
    } else {
      throw createError({
        statusCode: error.status,
        statusMessage: error.message,
      });
    }
  }
  return data;
});
