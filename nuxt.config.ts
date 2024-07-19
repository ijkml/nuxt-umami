export default defineNuxtConfig({
  compatibilityDate: '2024-07-19',
  appConfig: {
    umami: {
      id: '',
      host: '',
      version: 1,
      domains: '',
      debug: false,
      autoTrack: true,
      useDirective: false,
      customEndpoint: '/',
      ignoreLocalhost: false,
    },
  },
  runtimeConfig: {
    public: {
      umamiHost: '',
      umamiId: '',
    },
  },
});
