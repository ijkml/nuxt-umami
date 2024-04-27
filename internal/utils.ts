import type {
  FetchResult,
  PartialPayload,
  PreflightResult,
  ServerPayload,
} from './types';
import { debug } from './debug';

function isValidString(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '';
}

function isValidHost(host: unknown): host is string {
  try {
    if (typeof host !== 'string')
      return false;

    const url = new URL(host);
    return isValidString(url.host) && ['http:', 'https:'].includes(url.protocol);
  }
  catch (error) {
    return false;
  }
}

const umConfig = computed(() => {
  const { public: { umamiHost, umamiId } } = useRuntimeConfig();

  const {
    umami: {
      host: _host = '',
      id = '',
      domains = undefined,
      ignoreLocalhost: ignoreLocal = false,
      autoTrack = true,
      customEndpoint: _customEP = undefined,
      version: _ver = 1,
      useDirective = false,
      debug = false,
    } = {},
  } = useAppConfig();

  const customEP = isValidString(_customEP) ? _customEP.trim() : undefined;

  const customEndpoint = (customEP && customEP !== '/')
    ? customEP.startsWith('/')
      ? _customEP
      : `/${_customEP}`
    : undefined;

  const rawHost = umamiHost || _host;
  const host = isValidHost(rawHost) ? rawHost : null;
  const version = host && host.includes('analytics.umami.is') ? 2 : _ver;

  return {
    host,
    id: umamiId || id,
    domains,
    ignoreLocal,
    autoTrack,
    customEndpoint,
    version,
    useDirective,
    debug: !!debug,
  };
});

const helloDebugger = computed(() => {
  const enabled = import.meta.env.DEV ? true : umConfig.value.debug;

  type DetectiveParams = Parameters<typeof debug>;

  return enabled
    ? function (...params: DetectiveParams) {
      debug(...params);
    }
    : function (..._params: DetectiveParams) {};
});

const domainList = computed(() => {
  const domains = umConfig.value.domains;

  return (Array.isArray(domains) && domains.length)
    ? domains.filter(isValidString)
    : isValidString(domains)
      ? domains.split(',').map(d => d.trim()).filter(isValidString)
      : undefined;
});

const endpoint = computed(() => {
  const { host, customEndpoint, version } = umConfig.value;
  const { host: urlHost = '', protocol = '' } = host ? new URL(host) : {};

  const branch = customEndpoint || (version === 2 ? '/api/send' : '/api/collect');

  return `${protocol}//${urlHost}${branch}`;
});

const preflight = computed((): PreflightResult => {
  if (typeof window === 'undefined')
    return 'ssr';

  const { id, host, ignoreLocal } = umConfig.value;

  if (!isValidString(id))
    return 'id';

  if (!host || !isValidHost(endpoint.value))
    return 'host';

  const {
    location: { hostname },
  } = window;

  if (ignoreLocal && hostname === 'localhost')
    return 'local';

  const domains = domainList.value;

  if (domains && !domains.includes(hostname))
    return 'domain';

  return true;
});

const getPayload = computed((): PartialPayload => {
  const {
    location: { hostname },
    screen: { width, height },
    navigator: { language },
    document: { referrer, title },
  } = window;

  const { fullPath, query } = useRoute();
  const pageRef = referrer || (query.ref as string) || '';

  return {
    screen: `${width}x${height}`,
    language,
    hostname,
    url: encodeURI(fullPath),
    referrer: encodeURI(pageRef),
    title: encodeURIComponent(title),
  };
});

const cache = ref('');

function earlyPromise(ok: boolean): FetchResult {
  return Promise.resolve({ ok });
}

async function collect(load: ServerPayload): FetchResult {
  return fetch(endpoint.value, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cache.value && { 'x-umami-cache': cache.value }),
    },
    body: JSON.stringify(load),
  })
    .then(async (response) => {
      if (!response.ok)
        throw new Error('Network error', { cause: response });

      cache.value = await response.text();
      return { ok: true };
    })
    .catch((err) => {
      helloDebugger.value('err-collect', err);
      return { ok: false };
    });
}

export { isValidString, preflight, getPayload, collect, earlyPromise, umConfig, helloDebugger };
