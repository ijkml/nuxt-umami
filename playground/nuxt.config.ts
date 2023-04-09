import UmamiMetrics from '../src/module';

export default defineNuxtConfig({
  modules: [
    UmamiMetrics,
  ],
  umami: {
    websiteId: 'ba4c9424-c4b7-48df-b66d-4213730673e5', // string
    scriptUrl: 'https://ml-umami.netlify.app/umami.js', // string
    // autoTrack: true, // bool
    // domains: '', // string
    // cache: true, // bool
    // enable: false, // bool
    // doNotTrack: false, // bool
    // hostUrl: undefined, // string
  },
});
