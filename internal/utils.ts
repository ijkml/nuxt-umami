import { useTitle } from '@vueuse/core';
import type {
  GetPayloadReturn,
  PartialPayload,
  PreflightResult,
  ServerPayload,
} from './types';
import { helloDebugger } from './debug';

function isValidString(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '';
}

function isValidHost(host: unknown): host is string {
  try {
    if (typeof host !== 'string') {
      return false;
    }
    const url = new URL(host);
    return isValidString(url.host) && ['http:', 'https:'].includes(url.protocol);
  } catch (error) {
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
      ignoreDnt = true,
      ignoreLocalhost: ignoreLocal = false,
      autoTrack = true,
      customEndpoint: _customEP = undefined,
      version: _ver = 1,
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
  const { host: urlHost = '', protocol = '' } = host ? new URL(host) : {};

  const branch = customEndpoint || (version === 2 ? '/api/send' : '/api/collect');

  return `${protocol}//${urlHost}${branch}`;
});

const preflight = computed((): PreflightResult => {
  if (typeof window === 'undefined') {
    return 'ssr';
  }

  const { ignoreDnt, id, host, ignoreLocal } = umConfig.value;

  if (!isValidString(id)) {
    return 'id';
  }

  if (!host || !isValidHost(endpoint.value)) {
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
    document: { referrer, title },
  } = window;

  const pageTitle = useTitle();
  const { fullPath: pageUrl } = useRoute();

  const payload: PartialPayload = {
    screen: `${width}x${height}`,
    language,
    hostname,
    url: pageUrl,
    referrer,
    title: pageTitle.value || title,
  };

  return {
    payload,
    pageReferrer: referrer,
    pageUrl,
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

export { isValidString, preflight, getPayload, collect, umConfig };
