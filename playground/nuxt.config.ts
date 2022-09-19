import UmamiMetrics from '../src/module';

export default defineNuxtConfig({
  modules: [
    UmamiMetrics,
  ],
  umami: {
    autoTrack: true,
    /* local */
    websiteId: '3c255b6d-678a-42dd-8074-272ee5b78484',
    scriptUrl: 'http://localhost:3001/umami.js',
    domains: '',
    cache: true,
  },
});
