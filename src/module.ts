import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { addPlugin, defineNuxtModule } from '@nuxt/kit';
import type { ModuleOptions } from './types';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@ml/nuxt-umami',
    configKey: 'umami',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    autoTrack: undefined,
    doNotTrack: undefined,
    cache: undefined,
    domains: undefined,
    websiteId: undefined,
    scriptUrl: undefined,
    hostUrl: undefined,
  },
  setup(options, nuxt) {
    const { autoTrack, cache, doNotTrack, scriptUrl, websiteId, hostUrl, domains } = options;

    function isValidString(str: any) {
      return typeof str === 'string' && str !== '';
    }

    function isBoolean(bool: any) {
      return typeof bool === 'boolean';
    }

    // mandatory options check
    if (!isValidString(websiteId)) {
      throw new Error('Umami requires websiteId to be set');
    }
    if (!isValidString(scriptUrl)) {
      throw new Error('Umami requires scriptUrl to be set');
    }

    const resolvedOptions: ModuleOptions = {
      websiteId,
      scriptUrl,
      // optional
      domains: isValidString(domains) ? domains : undefined,
      hostUrl: isValidString(hostUrl) ? hostUrl : undefined,
      // boolean
      doNotTrack: isBoolean(doNotTrack) ? doNotTrack : undefined,
      cache: isBoolean(cache) ? cache : undefined,
      autoTrack: isBoolean(autoTrack) ? autoTrack : undefined,
    };

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);

    nuxt.options.runtimeConfig.public.umami = resolvedOptions as any;

    addPlugin({ src: resolve(runtimeDir, 'plugin'), mode: 'client' });
  },
});

export { ModuleOptions };
