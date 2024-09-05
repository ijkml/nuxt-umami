import type {
  StaticPayload, EventPayload, ViewPayload, IdentifyPayload,
  PreflightResult, EventData, FetchResult,
} from '../types';
import { earlyPromise, flattenObject, isValidString } from './utils';
import { collect, config, logger } from '#build/umami.config.mjs';

let configChecks: PreflightResult | undefined;
let staticPayload: StaticPayload | undefined;

function runPreflight(): PreflightResult {
  if (typeof window === 'undefined')
    return 'ssr';

  // Disable tracking when umami.disabled=1 in localStorage
  if (window.localStorage.getItem('umami.disabled') === '1')
    return 'local-storage';

  if (configChecks)
    return configChecks;

  configChecks = (function (): PreflightResult {
    const { ignoreLocalhost, domains } = config;
    const hostname = window.location.hostname;

    if (ignoreLocalhost && hostname === 'localhost')
      return 'localhost';

    if (domains && !domains.includes(hostname))
      return 'domain';

    return true;
  })();

  return configChecks;
};

function getStaticPayload(): StaticPayload {
  if (staticPayload)
    return staticPayload;

  const {
    location: { hostname },
    screen: { width, height },
    navigator: { language },
  } = window;

  staticPayload = {
    hostname,
    language,
    screen: `${width}x${height}`,
  };

  return staticPayload;
}

function getPayload(): ViewPayload {
  const { referrer, title } = window.document;
  const pageUrl = new URL(window.location.href);

  const ref = referrer
    || pageUrl.searchParams.get('referrer')
    || pageUrl.searchParams.get('ref')
    || '';

  const url = config.excludeQueryParams
    ? pageUrl.pathname
    : pageUrl.pathname + pageUrl.search;

  return {
    ...getStaticPayload(),
    url: encodeURI(url),
    referrer: encodeURI(ref),
    title: encodeURIComponent(title),
  };
};

/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param url page being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referrer page referrer, `document.referrer`
 */
function umTrackView(url?: string, referrer?: string): FetchResult {
  const check = runPreflight();

  if (check === 'ssr')
    return earlyPromise(false);

  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }

  return collect({
    type: 'event',
    payload: {
      ...getPayload(),
      ...(isValidString(referrer) && { referrer: encodeURI(referrer) }),
      ...(isValidString(url) && { url: encodeURI(url) }),
    } satisfies ViewPayload,
  });
}

/**
 * Tracks an event with a custom event type.
 *
 * @param eventName event name, eg 'CTA-button-click'
 * @param eventData additional data for the event, provide an object in the format
 * `{key: value}`, where `key` = `string`, `value` = `string | number | boolean`.
 */
function umTrackEvent(eventName: string, eventData?: EventData): FetchResult {
  const check = runPreflight();

  if (check === 'ssr')
    return earlyPromise(false);

  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }

  const data = flattenObject(eventData);
  let name = eventName;

  if (!isValidString(eventName)) {
    logger('event-name');
    name = '#unknown-event';
  }

  return collect({
    type: 'event',
    payload: {
      name,
      ...getPayload(),
      ...(data && { data }),
    } satisfies EventPayload,
  });
}

/**
 * Save data about the current session.
 *
 * Umami now supports saving session data, and
 * it works very similarly to custom event data.
 * @see [v2.13.0 release](https://github.com/umami-software/umami/releases/tag/v2.13.0)
 *
 * @param sessionData data for this session, provide an object in the format
 * `{key: value}`, where `key` = `string`, `value` = `string | number | boolean`.
 */
function umIdentify(sessionData?: EventData): FetchResult {
  const check = runPreflight();

  if (check === 'ssr')
    return earlyPromise(false);

  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }

  const data = flattenObject(sessionData);

  return collect({
    type: 'identify',
    payload: {
      ...getPayload(),
      ...(data && { data }),
    } satisfies IdentifyPayload,
  });
}

export { umTrackEvent, umTrackView, umIdentify };
