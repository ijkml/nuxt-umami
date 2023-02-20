import type {
  BasicPayload,
  GetPayloadReturn,
  PreflightArgs,
  PreflightResult,
} from './types';

function isValidString(str: unknown): str is string {
  return typeof str === 'string' && str.trim() !== '';
}

function assert(value: unknown): asserts value {}

function preflight({ websiteId, ignoreDnt, domains }: PreflightArgs): PreflightResult {
  if (typeof window === 'undefined') {
    return 'ssr';
  }

  if (!isValidString(websiteId)) {
    return 'id';
  }

  const {
    location: { hostname },
    navigator,
  } = window;

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

function getPayload(websiteId: string): GetPayloadReturn {
  const {
    location: { hostname, pathname, search, hash },
    screen: { width, height },
    navigator,
    document: { referrer: pageReferrer },
  } = window;

  const pageUrl = pathname + search + hash;

  const payload: BasicPayload = {
    screen: `${width}x${height}`,
    language: navigator.language,
    hostname,
    url: pageUrl,
    website: websiteId,
  };

  return {
    payload,
    pageUrl,
    pageReferrer,
  };
}

export { preflight, getPayload, assert };
