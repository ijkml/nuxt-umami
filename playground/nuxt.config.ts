import { defineNuxtConfig } from 'nuxt';
import UmamiMetrics from '../src/module';

export default defineNuxtConfig({
  modules: [
    UmamiMetrics,
  ],
  umami: {
    autoTrack: true,
    // websiteId: 'ffcc51f0-9490-468a-bff9-2d0a0bb9ae60',
    // scriptUrl: 'https://ijkml-umami.up.railway.app/umami.js',

    /* local */
    websiteId: '3c255b6d-678a-42dd-8074-272ee5b78484',
    scriptUrl: 'http://localhost:3000/umami.js',
    domains: '',
    cache: true,
  },
});
