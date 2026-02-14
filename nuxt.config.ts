import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["./app/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  devtools: { enabled: true },
  nitro: {
    preset: "vercel",
  },
  icon: {
    mode: "css",
    cssLayer: "base",
    collections: ["lucide", "cib"],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["lucide-vue-next"],
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
    storageKey: "tigajajan-color-mode",
  },
  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: !process.dev,
    },
  },
  echarts: {
    renderer: ["canvas"],
    charts: ["BarChart", "LineChart", "PieChart"],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent"],
    features: ["LabelLayout", "UniversalTransition"],
  },

  modules: [
    "@nuxt/icon",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@nuxt/image",
    "nuxt-echarts",
  ],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
});
