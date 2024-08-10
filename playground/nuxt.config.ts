export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-08',

  modules: ['../src/module'],
  umami: {
    enabled: true,
    host: 'https://savory.vercel.app/',
    id: '84cc2d28-8689-4df0-b575-2202e34a75aa',
    ignoreLocalhost: false,
    autoTrack: true,
    useDirective: true,
    customEndpoint: null,
    logErrors: true,
    domains: null,
    excludeQueryParams: false,
    proxy: 'cloak',
  },

  css: ['@/assets/reset.css'],
});
