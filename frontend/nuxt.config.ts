// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/icon', '@pinia/nuxt'],
  css: ['~/assets/css/main.css', '~/assets/css/fonts.css', '~/assets/css/colors.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})