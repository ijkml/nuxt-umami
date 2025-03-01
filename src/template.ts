import type { ModuleMode, UmPublicConfig } from './types';

interface TemplateOptions {
  options: {
    mode: ModuleMode;
    config: UmPublicConfig & { logErrors: boolean };
    path: {
      utils: string;
      types: string;
      logger: string;
    };
  };
};

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

const collectFn: Record<`fn_${ModuleMode}`, string> = { fn_direct, fn_faux, fn_proxy };

function generateTemplate({
  options: { mode, path, config: { logErrors, ...config } },
}: TemplateOptions) {
  return `// template-generated
import { ofetch } from 'ofetch';
import { ${logErrors ? 'logger' : 'fauxLogger'} as $logger } from "${path.logger}";

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
  
    url.pathname = ${config.urlOptions.trailingSlash === 'always'
      ? `path.endsWith('/') ? path : path + '/'`
      : config.urlOptions.trailingSlash === 'never'
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
