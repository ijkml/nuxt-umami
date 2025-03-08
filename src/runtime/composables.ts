import type {
  CurrencyCode,
  EventData,
  EventPayload,
  FetchResult,
  IdentifyPayload,
  PreflightResult,
  StaticPayload,
  ViewPayload,
} from '../types';
import { buildPathUrl, collect, config, logger } from '#build/umami.config.mjs';
import { earlyPromise, flattenObject, isValidString } from './utils';

let configChecks: PreflightResult | undefined;
let staticPayload: StaticPayload | undefined;
let queryRef: string | undefined;

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
}

function getStaticPayload(): StaticPayload {
  if (staticPayload)
    return staticPayload;

  const {
    location: { hostname },
    screen: { width, height },
    navigator: { language },
  } = window;

  const { tag } = config;

  staticPayload = {
    hostname,
    language,
    screen: `${width}x${height}`,
    ...(tag ? { tag } : null),
  };

  return staticPayload;
}

function getQueryRef(): string {
  if (typeof queryRef === 'string')
    return queryRef;

  const params = new URL(window.location.href).searchParams;
  queryRef = params.get('referrer') || params.get('ref') || '';

  return queryRef;
}

function getPayload(): ViewPayload {
  const { referrer, title } = window.document;
  const { origin, href } = window.location;

  const url = buildPathUrl(href);
  const tag = window.localStorage.getItem('umami.tag');
  const ref = referrer && !referrer.startsWith(origin) ? referrer : getQueryRef();

  return {
    ...getStaticPayload(),
    ...(tag ? { tag } : null),
    url,
    title,
    referrer: ref,
    ...{
      website: config.website?.length ? config.website : undefined,
    },
  };
}

/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param path url being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referrer page referrer, `document.referrer`
 */
function umTrackView(path?: string, referrer?: string): FetchResult {
  const check = runPreflight();

  if (check === 'ssr')
    return earlyPromise(false);

  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }

  const url = buildPathUrl(isValidString(path) ? path : null);

  return collect({
    type: 'event',
    payload: {
      ...getPayload(),
      ...(isValidString(url) && { url }),
      ...(isValidString(referrer) && { referrer }),
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

/**
 * Tracks financial performance
 * @see [Umami Docs](https://umami.is/docs/reports/report-revenue)
 *
 * @param eventName [revenue] event name
 * @param revenue revenue / amount
 * @param currency currency code (defaults to USD)
 * ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes))
 */
function umTrackRevenue(eventName: string, revenue: number, currency: CurrencyCode = 'USD'): FetchResult {
  const $rev = typeof revenue === 'number' ? revenue : Number(revenue);

  if (Number.isNaN($rev) || !Number.isFinite(revenue)) {
    // if you ever run into troubles with isFinite (or not),
    // please buy me a coffee ;) bmc.link/ijkml
    logger('revenue', revenue);
    return earlyPromise(false);
  }

  let $cur: string | null = null;

  if (typeof currency === 'string' && /^[A-Z]{3}$/i.test(currency.trim()))
    $cur = currency.trim();
  else logger('currency', `Got: ${currency}`);

  return umTrackEvent(eventName, {
    revenue: $rev,
    ...($cur ? { currency: $cur } : null),
  });
}

/**
 * Request and alter the tracker configuration
 */
function umConfig() {
  return {
    ...config,
    ...{
      setId(w: string) {
        config.website = w;
      },
    },
  };
}

export { umConfig, umIdentify, umTrackEvent, umTrackRevenue, umTrackView };
