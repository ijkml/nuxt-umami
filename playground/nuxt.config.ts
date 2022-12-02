import UmamiMetrics from '../src/module';

export default defineNuxtConfig({
  modules: [
    UmamiMetrics,
  ],
  umami: {
    websiteId: '3c255b6d-678a-42dd-8074-272ee5b78484', // string
    scriptUrl: 'http://localhost:3001/umami.js', // string
    // autoTrack: true, // bool
    // domains: '', // string
    // cache: true, // bool
    // enable: false, // bool
    // doNotTrack: false, // bool
    // hostUrl: undefined, // string
  },
});
