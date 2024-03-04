import { useTitle } from '@vueuse/core';

import type {
  PartialPayload,
  PreflightResult,
  ServerPayload,
} from './types';
import { detective } from './debug';

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

  type DetectiveParams = Parameters<typeof detective>;

  return enabled
    ? function (...params: DetectiveParams) {
      detective(...params);
    }
    : function (..._args: DetectiveParams) {};
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
    location: { hostname, href },
    screen: { width, height },
    navigator: { language },
    document: { referrer, title },
  } = window;

  const pageTitle = useTitle();
  const { fullPath: pageUrl } = useRoute();

  // get ref from url
  const params = new URL(href).searchParams;
  const pageRef = referrer || params.get('ref') || '';

  return {
    screen: `${width}x${height}`,
    language,
    hostname,
    url: encodeURI(pageUrl),
    referrer: encodeURI(pageRef),
    title: encodeURIComponent(pageTitle.value || title),
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
      if (res && !res.ok)
        helloDebugger.value('err-collect', res);
    })
    .catch((err) => {
      helloDebugger.value('err-collect', err);
    });
}

export { isValidString, preflight, getPayload, collect, umConfig, helloDebugger };
