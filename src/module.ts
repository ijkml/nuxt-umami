import {
  addImports, addPlugin, addTemplate, addServerHandler,
  createResolver, defineNuxtModule,
} from '@nuxt/kit';
import { name, version } from '../package.json';
import type { ModuleMode, ModuleOptions, NormalizedModuleOptions, UmPublicConfig } from './types';
import { isValidString, normalizeConfig } from './runtime/utils';
import { generateTemplate } from './template';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'umami',
    compatibility: {
      nuxt: '>=3',
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    const pathTo = {
      utils: resolve('./runtime/utils'),
      logger: resolve('./runtime/logger'),
      types: resolve('./types'),
    } as const;

    // TODO: transpile?
    // const runtimeDir = resolve('./runtime')
    // nuxt.options.build.transpile.push(runtimeDir)

    const runtimeConfig = nuxt.options.runtimeConfig;
    const ENV = process.env;

    const envHost = ENV.NUXT_UMAMI_HOST || ENV.NUXT_PUBLIC_UMAMI_HOST;
    const envId = ENV.NUXT_UMAMI_ID || ENV.NUXT_PUBLIC_UMAMI_ID;

    const {
      enabled,
      host, id, customEndpoint,
      domains, proxy, logErrors,
      ...runtimeOptions
    } = normalizeConfig({
      ...options,
      ...(isValidString(envId) && { id: envId }),
      ...(isValidString(envHost) && { host: envHost }),
    });

    const endpoint = host ? new URL(host).origin + (customEndpoint || '/api/send') : '';

    const publicConfig = {
      ...runtimeOptions,
      enabled,
      domains,
      website: '',
      endpoint: '',
    } satisfies UmPublicConfig;

    const privateConfig = { endpoint: '', website: '', domains };

    let mode: ModuleMode = 'faux';
    const proxyOpts: Array<NormalizedModuleOptions['proxy']> = ['direct', 'cloak'];

    if (enabled && endpoint && id) {
      // ^ module is enabled && endpoint/id has no errors
      if (proxyOpts.includes(proxy) && nuxt.options.ssr) {
        // ^ ssr is enabled, requests can be proxied
        if (proxy === 'cloak') {
          // ^ proxy mode: cloak; add API route
          mode = 'proxy';
          addServerHandler({
            route: '/api/savory',
            handler: resolve('./runtime/server/endpoint'),
          });
          privateConfig.endpoint = endpoint;
          privateConfig.website = id;
        }
        else if (proxy === 'direct') {
          // ^ proxy mode: direct; add proxy rule
          mode = 'direct';
          publicConfig.endpoint = '/api/savory';
          publicConfig.website = id;
          nuxt.options.routeRules ||= {};
          nuxt.options.routeRules['/api/savory'] = { proxy: endpoint };
        }
      }
      else {
        // ^ proxy mode: none; or ssr is disabled
        mode = 'direct';
        publicConfig.endpoint = endpoint;
        publicConfig.website = id;
      }
    }
    else {
      // ^ module is disabled || host/id has errors
      if (!id)
        console.warn('[umami] id is missing or incorrectly configured. Check module config.');
      if (!endpoint) {
        console.warn(
          '[umami] Your API endpoint is missing or incorrectly configured. Check `host` and/or `customEndpoint` in module config.',
        );
      }

      console.info(`[umami] ${
        enabled
          ? 'Currently running in test mode due to incorrect/missing options.'
          : 'Umami is disabled.'
      }`);
    }

    // add private config to runtime, only usable in server
    runtimeConfig._proxyUmConfig = privateConfig;

    // generate utils template
    addTemplate({
      getContents: generateTemplate,
      filename: 'umami.config.mjs',
      write: true,
      options: {
        mode,
        config: {
          ...publicConfig,
          logErrors: process.env.NODE_ENV === 'development' || logErrors,
        },
        path: pathTo,
      },
    });

    // add composables
    addImports(['umTrackEvent', 'umTrackView', 'umIdentify'].map((name) => {
      return {
        name,
        as: name,
        from: resolve('runtime/composables'),
      };
    }));

    // add auto-track & directive plugin
    addPlugin({
      name: 'nuxt-umami',
      src: resolve('./runtime/plugin'),
      mode: 'all',
    });
  },
});

// TODO:
// - show announcement to v2 users.
// - move to latest tag
