export default defineNuxtConfig({
  ssr: true,
  components: true,
  modules: [
    '@vueuse/nuxt',
  ],
  vueuse: {
    ssrHandlers: true,
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})