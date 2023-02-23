import type {
  GetPayloadReturn,
  PartialPayload,
  PreflightArgs,
  PreflightResult,
  ServerPayload,
} from '../internal/types';
import { helloDebugger } from '../internal/debug';

function isValidString(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '';
}

function assert(value: unknown): asserts value {}

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

function preflight(
  { ignoreDnt, domains, id, host, ignoreLocal }: PreflightArgs,
): PreflightResult {
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

  const domainList = isValidString(domains)
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
  const { umami: { host, version } } = useAppConfig();
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

export { preflight, getPayload, assert, collect };
