// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/icon",
    "@pinia/nuxt",
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: "pt-BR",
      },
    },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/css/fonts.css",
    "~/assets/css/colors.css",
  ],
  runtimeConfig: {
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "https://ichaves-backend.onrender.com/api",
    },
  },

  // Configuração para desenvolvimento
  devServer: {
    port: 3000,
  },
});
