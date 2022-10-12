import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineNuxtModule, isNuxt3, addPlugin } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "nuxt-umami",
    configKey: "umami",
    compatibility: {
      nuxt: "^2.0.0 || ^3.0.0-rc.9",
      bridge: false
    }
  },
  defaults: {
    autoTrack: void 0,
    doNotTrack: void 0,
    cache: void 0,
    domains: void 0,
    websiteId: void 0,
    scriptUrl: void 0,
    hostUrl: void 0
  },
  setup(options, nuxt) {
    const { autoTrack, cache, doNotTrack, scriptUrl, websiteId, hostUrl, domains } = options;
    function isValidString(str) {
      return typeof str === "string" && str !== "";
    }
    function isBoolean(bool) {
      return typeof bool === "boolean";
    }
    if (!isValidString(websiteId)) {
      throw new Error("Umami requires websiteId to be set");
    }
    if (!isValidString(scriptUrl)) {
      throw new Error("Umami requires scriptUrl to be set");
    }
    const resolvedOptions = {
      websiteId,
      scriptUrl,
      domains: isValidString(domains) ? domains : void 0,
      hostUrl: isValidString(hostUrl) ? hostUrl : void 0,
      doNotTrack: isBoolean(doNotTrack) ? doNotTrack : void 0,
      cache: isBoolean(cache) ? cache : void 0,
      autoTrack: isBoolean(autoTrack) ? autoTrack : void 0
    };
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);
    if (isNuxt3()) {
      nuxt.options.runtimeConfig.public.umami = resolvedOptions;
    } else {
      nuxt.options.publicRuntimeConfig.umami = resolvedOptions;
    }
    addPlugin({ src: resolve(runtimeDir, "plugin") });
  }
});

export { module as default };
