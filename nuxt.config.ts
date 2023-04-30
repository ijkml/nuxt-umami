export default defineNuxtConfig({
  appConfig: {
    umami: {
      id: '',
      host: '',
      version: 1,
      domains: '',
      autoTrack: true,
      ignoreDnt: true,
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
