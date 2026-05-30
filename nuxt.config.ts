// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components:[{
      path: '~/components',
      pathPrefix: true,
  }],

  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss'
  ],

  googleFonts: {
    families: {
      'Zalando+Sans': [400, 500, 600, 700]
    }
  }
})