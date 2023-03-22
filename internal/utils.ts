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
      version = 1,
    } = {},
  } = useAppConfig();

  return {
    host: umamiHost || host,
    id: umamiId || id,
    domains,
    ignoreDnt,
    ignoreLocal,
    autoTrack,
    version,
  };
});

function preflight(): PreflightResult {
  const { ignoreDnt, domains, id, host, ignoreLocal } = umConfig.value;

  if (typeof window === 'undefined') {
    return 'ssr';
  }

  if (!isValidString(id)) {
    return 'id';
  }

  if (isInvalidHost(host)) {
    return 'host';
  }

  const {
    location: { hostname },
    navigator,
  } = window;

  if (ignoreLocal && hostname === 'localhost') {
    return 'local';
  }

  const domainList = (Array.isArray(domains) && domains.length)
    ? domains
    : isValidString(domains)
      ? domains.split(',').map(d => d.trim())
      : undefined;

  if (domainList && !domainList.includes(hostname)) {
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
}

function getPayload(): GetPayloadReturn {
  const {
    location: { hostname, pathname, search, hash },
    screen: { width, height },
    navigator,
    document: { referrer: pageReferrer },
  } = window;

  const pageUrl = pathname + search + hash;

  const payload: PartialPayload = {
    screen: `${width}x${height}`,
    language: navigator.language,
    hostname,
    url: pageUrl,
  };

  return {
    payload,
    pageUrl,
    pageReferrer,
  };
}

async function collect(load: ServerPayload) {
  const { host, version } = umConfig.value;
  const root = new URL(host);
  const branch = version === 2 ? 'api/send' : 'api/collect';
  const endpoint = `${root.protocol}//${root.host}/${branch}`;

  fetch(endpoint, {
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
