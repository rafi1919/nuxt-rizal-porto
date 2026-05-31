// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components:[{
      path: '~/components',
      pathPrefix: true,
  }],
  site:{
    url: 'https://example.com',
    name: 'Rizzal Porto',
    description: 'Welcome to my awesome site!',
    defaultLocale: 'en', 
  },

  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt'
  ],

  googleFonts: {
    families: {
      'Zalando+Sans': [400, 500, 600, 700]
    }
  }
})