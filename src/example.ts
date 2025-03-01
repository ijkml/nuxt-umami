import type { ModuleOptions } from './types';

interface StubbedConfig {
  modules: Array<string>;
  umami: ModuleOptions;
}

function defineNuxtConfig(config: StubbedConfig) {
  return config;
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *    THESE BLANK LINES ARE HERE TO MAKE SURE THE CODE SNIPPET
 *    THAT GETS SHOWN STARTS AT <drumroll>
 *
 *    ------------------------ LINE 40 ------------------------
 *
 *    PLEASE DO NOT REMOVE THEM.
 *    THE EXCESS LINES CAN BE USED FOR ANY FUTURE NONSENSE.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

export default defineNuxtConfig({
  modules: ['nuxt-umami'],

  umami: {
    id: 'my-w3b517e-id',
    host: 'https://my-umami.xyz',
    autoTrack: true,
    // enabled: false,
    // useDirective: true,
    // ignoreLocalhost: true,
    // domains: ['cool-site.app', 'my-space.site'],
    // urlOptions: {
    //   trailingSlash: 'always',
    //   excludeSearch: false,
    //   excludeHash: false,
    // },
    // proxy: 'cloak',
    // logErrors: true,
    // customEndpoint: '/my-custom-endpoint',
    // tag: 'website-variation-123',
  },
});
