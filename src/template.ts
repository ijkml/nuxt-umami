import type { ModuleMode, NormalizedModuleOptions } from './types';

interface TemplateOptions {
  options: {
    mode: ModuleMode;
    path: {
      utils: string;
      types: string;
      logger: string;
    };
    urlOptions: Required<Required<NormalizedModuleOptions>['urlOptions']>;
    logErrors: boolean;
  };
};

// In faux mode: log config errors and bail out immediately.
// Reads enabled/endpoint/website from runtimeConfig at call time.
const fn_faux = `const { enabled, endpoint, website } = useRuntimeConfig().public.umami;
  const payload = load.payload;

  if (enabled) {
    if (!endpoint)
      logger('endpoint', payload);
    if (!website)
      logger('id', payload);

    return Promise.resolve({ ok: false });
  }
    
  logger('enabled');
  return Promise.resolve({ ok: true });`;

// In proxy (cloak) mode: forward to /api/savory (server handler reads real endpoint from private runtimeConfig).
const fn_proxy = `return ofetch('/api/savory', {
    method: 'POST',
    body: { ...load, cache },
  })
    .then(handleSuccess)
    .catch(handleError);`;

// In direct mode: read endpoint/website from public runtimeConfig at call time.
const fn_direct = `const { type, payload } = load;
  const { endpoint, website } = useRuntimeConfig().public.umami;

  return ofetch(endpoint, {
    method: 'POST',
    headers: { ...(cache && { 'x-umami-cache': cache }) },
    body: { type, payload: { ...payload, website } },
    credentials: 'omit',
  })
    .then(handleSuccess)
    .catch(handleError);`;

const collectFn: Record<`fn_${ModuleMode}`, string> = { fn_direct, fn_faux, fn_proxy };

function generateTemplate({
  options: { mode, path, urlOptions, logErrors },
}: TemplateOptions) {
  return `// template-generated
import { ofetch } from 'ofetch';
import { useRuntimeConfig } from '#imports';
import { ${logErrors ? 'logger' : 'fauxLogger'} as logger } from "${path.logger}";

export { logger };

/**
 * @typedef {import("${path.types}").FetchFn} FetchFn
 * 
 * @typedef {import("${path.types}").BuildPathUrlFn} BuildPathUrlFn
 */

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
  
    ${urlOptions.excludeHash && `url.hash = '';`}
    ${urlOptions.excludeSearch && `url.search = '';`}
  
    url.pathname = ${urlOptions.trailingSlash === 'always'
      ? `path.endsWith('/') ? path : path + '/'`
      : urlOptions.trailingSlash === 'never'
        ? `path.endsWith('/') ? path.slice(0, -1) : path`
        : `path`};
  
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

export { generateTemplate };
