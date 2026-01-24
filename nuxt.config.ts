import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    css: ['./app/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
      plugins: [
          tailwindcss(),
      ],
  },

  modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],
    shadcn: {
        prefix: '',
        componentDir: '@/components/ui'
    }

})