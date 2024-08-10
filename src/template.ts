import type { ModuleMode, UmPublicConfig } from './types';

const collectFns: Record<ModuleMode, string> = {
  faux: 'fauxCollect',
  proxy: 'proxyCollect',
  direct: 'directCollect',
};

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

function generateTemplate({ options: { mode, config: { logErrors, ...config }, path } }: TemplateOptions) {
  return `// template-generated
import { ofetch } from 'ofetch';
import { ${logErrors ? 'logger' : 'fauxLogger'} as $logger } from "${path.logger}";

/**
 * @typedef {import("${path.types}").FetchFn} FetchFn
 * 
 * @typedef {import("${path.types}").UmPublicConfig} UmPublicConfig
 */

export const logger = $logger;

/**
 * @type UmPublicConfig
*/
export const config = ${JSON.stringify(config, null, 2)};

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

async function _${collectFns.proxy}(load) {
  return ofetch('/api/savory', {
    method: 'POST',
    body: { ...load, cache },
  })
    .then(handleSuccess)
    .catch(handleError);
}

async function _${collectFns.faux}(load) {
  const { endpoint, website, enabled } = config;
  const payload = load.payload;

  if (enabled) {
    if (!endpoint)
      logger('endpoint', payload);
    if (!website)
      logger('id', payload);

    return Promise.resolve({ ok: false });
  }
    
  logger('enabled', payload);
  return Promise.resolve({ ok: true });
}

async function _${collectFns.direct}(load) {
  const { endpoint, website } = config;
  const { type, payload } = load;

  return ofetch(endpoint, {
    method: 'POST',
    headers: {
      ...(cache && { 'x-umami-cache': cache }),
    },
    body: { type, payload: { ...payload, website } },
  })
    .then(handleSuccess)
    .catch(handleError);
}

/**
 * @type FetchFn 
 */
export const collect = _${collectFns[mode]};
`;
}

export { generateTemplate };
