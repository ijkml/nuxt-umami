import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
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
