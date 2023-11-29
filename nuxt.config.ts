// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  title: 'Waxel Ninjas claim helper',
  devtools: { enabled: true },
  devServer: { host: '0.0.0.0' },

  modules: [
    '@pinia/nuxt',
  ],
})