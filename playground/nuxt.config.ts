export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-04-24',

  // Opt in to Nuxt v4 defaults (notably `srcDir: 'app/'`) while we're
  // still on the v3.15+ peer-dep floor. Flag is a no-op under Nuxt v4.
  future: { compatibilityVersion: 4 },

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
    proxy: 'cloak',
    tag: 'gondor',
    urlOptions: {
      excludeHash: false,
      excludeSearch: false,
      trailingSlash: 'always',
    },
  },

  appConfig: {
    shareUrl: 'https://savory.ijkml.dev/share/xj2RHnDuAD8khsui/localhost',
  },

  css: ['@/assets/reset.css'],
});
