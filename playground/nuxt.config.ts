export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-08-08',

  modules: ['../src/module'],

  umami: {
    enabled: true,
    host: 'https://savory.ijkml.dev/',
    id: '94c6eb8c-646d-41ff-8b5b-a924ce2b4111',
    ignoreLocalhost: false,
    autoTrack: true,
    useDirective: true,
    customEndpoint: null,
    logErrors: true,
    domains: null,
    excludeQueryParams: false,
    trailingSlash: 'always',
    proxy: 'cloak',
  },

  appConfig: {
    shareUrl: 'https://savory.ijkml.dev/share/xj2RHnDuAD8khsui/localhost',
  },

  css: ['@/assets/reset.css'],
});
