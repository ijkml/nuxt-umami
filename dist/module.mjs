import { defineNuxtModule, createResolver, addServerHandler, addTemplate, addImports, addPlugin } from '@nuxt/kit';
import { normalizeConfig, isValidString } from '../dist/runtime/utils.js';

const name = "nuxt-umami";
const version = "3.2.1";

const fn_faux = `const payload = load.payload;

  if (enabled) {
    if (!endpoint)
      logger('endpoint', payload);
    if (!website)
      logger('id', payload);

    return Promise.resolve({ ok: false });
  }
    
  logger('enabled');
  return Promise.resolve({ ok: true });`;
const fn_proxy = `return ofetch('/api/savory', {
    method: 'POST',
    body: { ...load, cache },
  })
    .then(handleSuccess)
    .catch(handleError);`;
const fn_direct = `const { type, payload } = load;

  return ofetch(endpoint, {
    method: 'POST',
    headers: { ...(cache && { 'x-umami-cache': cache }) },
    body: { type, payload: { ...payload, website } },
    credentials: 'omit',
  })
    .then(handleSuccess)
    .catch(handleError);`;
const collectFn = { fn_direct, fn_faux, fn_proxy };
function generateTemplate({
  options: { mode, path, config: { logErrors, ...config } }
}) {
  return `// template-generated
import { ofetch } from 'ofetch';
import { ${logErrors ? "logger" : "fauxLogger"} as $logger } from "${path.logger}";

/**
 * @typedef {import("${path.types}").FetchFn} FetchFn
 * 
 * @typedef {import("${path.types}").BuildPathUrlFn} BuildPathUrlFn
 * 
 * @typedef {import("${path.types}").UmPublicConfig} UmPublicConfig
 */

export const logger = $logger;

/**
 * @type UmPublicConfig
*/
export const config = ${JSON.stringify(config, null, 2)};

const { endpoint, website, enabled } = config;
let cache = '';

function handleError(err) {
  try {
    const cause = typeof err.data === 'string' ? err.data : err.data.data;
    if (cause && typeof cause === 'string')
      logger('collect', cause);
    else throw new Error('Unknown error');
  }
  catch {
    logger('collect', err);
  }
  return { ok: false };
}

function handleSuccess(response) {
  cache = typeof response === 'string' ? response : '';
  return { ok: true };
}

/**
 * @type BuildPathUrlFn
 */
export function buildPathUrl(loc) {
  try {
    if (loc === null)
      throw new Error('null value');

    const url = new URL(loc, window.location.href);
    const path = url.pathname;
  
    ${config.urlOptions.excludeHash && `url.hash = '';`}
    ${config.urlOptions.excludeSearch && `url.search = '';`}
  
    url.pathname = ${config.urlOptions.trailingSlash === "always" ? `path.endsWith('/') ? path : path + '/'` : config.urlOptions.trailingSlash === "never" ? `path.endsWith('/') ? path.slice(0, -1) : path` : `path`};
  
    return url.toString();
  } catch {
    return '';
  }
}

/**
 * @type FetchFn 
 * 
 * @variation ${mode}
 */
export async function collect(load) {
  ${collectFn[`fn_${mode}`]}
}
`;
}

const module = defineNuxtModule({
  meta: {
    name,
    version,
    configKey: "umami",
    compatibility: {
      nuxt: ">=3"
    }
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const pathTo = {
      utils: resolve("./runtime/utils"),
      logger: resolve("./runtime/logger"),
      types: resolve("./types")
    };
    const runtimeConfig = nuxt.options.runtimeConfig;
    const ENV = process.env;
    const envHost = ENV.NUXT_UMAMI_HOST || ENV.NUXT_PUBLIC_UMAMI_HOST;
    const envId = ENV.NUXT_UMAMI_ID || ENV.NUXT_PUBLIC_UMAMI_ID;
    const envTag = ENV.NUXT_UMAMI_TAG || ENV.NUXT_PUBLIC_UMAMI_TAG;
    const {
      enabled,
      host,
      id,
      customEndpoint,
      domains,
      proxy,
      logErrors,
      ...runtimeOptions
    } = normalizeConfig({
      ...options,
      ...isValidString(envId) && { id: envId },
      ...isValidString(envHost) && { host: envHost },
      ...isValidString(envTag) && { tag: envTag }
    });
    const endpoint = host ? new URL(host).origin + (customEndpoint || "/api/send") : "";
    const publicConfig = {
      ...runtimeOptions,
      enabled,
      domains,
      website: "",
      endpoint: ""
    };
    const privateConfig = { endpoint: "", website: "", domains };
    let mode = "faux";
    const proxyOpts = ["direct", "cloak"];
    if (enabled && endpoint && id) {
      if (proxyOpts.includes(proxy)) {
        if (proxy === "cloak") {
          mode = "proxy";
          addServerHandler({
            route: "/api/savory",
            handler: resolve("./runtime/server/endpoint")
          });
          privateConfig.endpoint = endpoint;
          privateConfig.website = id;
        } else if (proxy === "direct") {
          mode = "direct";
          publicConfig.endpoint = "/api/savory";
          publicConfig.website = id;
          nuxt.options.routeRules ||= {};
          nuxt.options.routeRules["/api/savory"] = { proxy: endpoint };
        }
      } else {
        mode = "direct";
        publicConfig.endpoint = endpoint;
        publicConfig.website = id;
      }
    } else {
      if (!id)
        console.warn("[umami] id is missing or incorrectly configured. Check module config.");
      if (!endpoint) {
        console.warn(
          "[umami] Your API endpoint is missing or incorrectly configured. Check `host` and/or `customEndpoint` in module config."
        );
      }
      console.info(`[umami] ${enabled ? "Currently running in test mode due to incorrect/missing options." : "Umami is disabled."}`);
    }
    runtimeConfig._proxyUmConfig = privateConfig;
    addTemplate({
      getContents: generateTemplate,
      filename: "umami.config.mjs",
      write: true,
      options: {
        mode,
        config: {
          ...publicConfig,
          logErrors: process.env.NODE_ENV === "development" || logErrors
        },
        path: pathTo
      }
    });
    const composables = ["umTrackEvent", "umTrackView", "umIdentify", "umTrackRevenue"];
    addImports(composables.map((name2) => {
      return {
        name: name2,
        as: name2,
        from: resolve("runtime/composables")
      };
    }));
    addPlugin({
      name: "nuxt-umami",
      src: resolve("./runtime/plugin"),
      mode: "all"
    });
  }
});

export { module as default };
