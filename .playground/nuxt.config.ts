import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  extends: '..',
  typescript: {
    includeWorkspace: true,
  },
});
