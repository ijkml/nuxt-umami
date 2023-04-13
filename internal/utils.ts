import type {
  GetPayloadReturn,
  PartialPayload,
  PreflightResult,
  ServerPayload,
} from '../internal/types';
import { helloDebugger } from '../internal/debug';

function isValidString(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '';
}

function isInvalidHost(host: unknown): host is string {
  try {
    if (typeof host !== 'string') {
      return false;
    }
    const url = new URL(host);
    return !(isValidString(url.host) && ['http:', 'https:'].includes(url.protocol));
  } catch (error) {
    return true;
  }
}

const umConfig = computed(() => {
  const { public: { umamiHost, umamiId } } = useRuntimeConfig();

  const {
    umami: {
      host = '',
      id = '',
      domains = undefined,
      ignoreDnt = true,
      ignoreLocalhost: ignoreLocal = false,
      autoTrack = true,
      customEndpoint: _customEP = undefined,
      version = 1,
    } = {},
  } = useAppConfig();

  const customEP = isValidString(_customEP) ? _customEP.trim() : undefined;

  const customEndpoint = (customEP && customEP !== '/')
    ? customEP.startsWith('/')
      ? _customEP
      : `/${_customEP}`
    : undefined;

  return {
    host: umamiHost || host,
    id: umamiId || id,
    domains,
    ignoreDnt,
    ignoreLocal,
    autoTrack,
    customEndpoint,
    version,
  };
});

const domainList = computed(() => {
  const domains = umConfig.value.domains;

  return (Array.isArray(domains) && domains.length)
    ? domains
    : isValidString(domains)
      ? domains.split(',').map(d => d.trim())
      : undefined;
});

const endpoint = computed(() => {
  const { host, customEndpoint, version } = umConfig.value;
  const root = new URL(host);
  const branch = customEndpoint || (version === 2 ? '/api/send' : '/api/collect');

  return `${root.protocol}//${root.host}${branch}`;
});

const preflight = computed((): PreflightResult => {
  if (typeof window === 'undefined') {
    return 'ssr';
  }

  const { ignoreDnt, id, host, ignoreLocal } = umConfig.value;

  if (!isValidString(id)) {
    return 'id';
  }

  if (isInvalidHost(host) || isInvalidHost(endpoint.value)) {
    return 'host';
  }

  const {
    location: { hostname },
    navigator,
  } = window;

  if (ignoreLocal && hostname === 'localhost') {
    return 'local';
  }

  const domains = domainList.value;

  if (domains && !domains.includes(hostname)) {
    return 'domain';
  }

  if (!ignoreDnt && [1, '1', 'yes'].includes(
    navigator.doNotTrack
    // @ts-expect-error `doNotTrack` might not exist on `window`
    || window.doNotTrack
    // @ts-expect-error `msDoNotTrack` might not exist on `navigator`
    || navigator.msDoNotTrack,
  )) {
    return 'dnt';
  }

  return true;
});

const getPayload = computed((): GetPayloadReturn => {
  const {
    location: { hostname },
    screen: { width, height },
    navigator: { language },
    document: { referrer },
  } = window;

  const { fullPath } = useRoute();

  const payload: PartialPayload = {
    screen: `${width}x${height}`,
    language,
    hostname,
    url: fullPath,
  };

  return {
    payload,
    pageUrl: fullPath,
    pageReferrer: referrer,
  };
});

async function collect(load: ServerPayload) {
  fetch(endpoint.value, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(load),
  })
    .then((res) => {
      if (res && !res.ok) {
        helloDebugger('err-collect', res);
      }
    })
    .catch((err) => {
      helloDebugger('err-collect', err);
    });
}

export { preflight, getPayload, collect, umConfig };
