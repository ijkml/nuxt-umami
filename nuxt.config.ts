export default defineNuxtConfig({
  appConfig: {
    umami: {
      id: '',
      host: '',
      version: 1,
      domains: '',
      autoTrack: true,
      ignoreDnt: true,
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
