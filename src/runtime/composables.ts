import type {
  CurrencyCode,
  EventData,
  EventPayload,
  FetchResult,
  IdentifyPayload,
  PerformancePayload,
  PreflightResult,
  StaticPayload,
  ViewPayload,
} from '../types';
import { buildPathUrl, collect } from '#build/umami.config.mjs';
import { useRuntimeConfig } from '#imports';
import { logger } from './logger';
import { earlyPromise, flattenObject, isValidString } from './utils';

let configChecks: PreflightResult | undefined;
let staticPayload: StaticPayload | undefined;
let queryRef: string | undefined;
let queryRefConsumed = false;
let identifyId: string | undefined;

function runPreflight(): PreflightResult {
  if (typeof window === 'undefined')
    return 'ssr';

  // Disable tracking when umami.disabled=1 in localStorage
  if (window.localStorage.getItem('umami.disabled') === '1')
    return 'local-storage';

  if (configChecks)
    return configChecks;

  configChecks = (function (): PreflightResult {
    const { ignoreLocalhost, domains } = useRuntimeConfig().public.umami;
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

  const { tag } = useRuntimeConfig().public.umami;

  staticPayload = {
    hostname,
    language,
    screen: `${width}x${height}`,
    ...(tag ? { tag } : null),
  };

  return staticPayload;
}

function getQueryRef(): string {
  // Only read and use the URL referral param once (on the landing page).
  // After the first pageview is tracked, reset it so subsequent SPA
  // navigations don't keep attributing all views to the original referrer.
  if (queryRefConsumed)
    return '';

  if (typeof queryRef !== 'string') {
    const params = new URL(window.location.href).searchParams;
    queryRef = params.get('referrer') || params.get('ref') || '';
  }

  return queryRef;
}

function consumeQueryRef(): void {
  queryRefConsumed = true;
  queryRef = '';
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
    // Auto-include the distinct ID on all payloads after umIdentify is called,
    // matching the behaviour of the official Umami tracker script.
    ...(identifyId ? { id: identifyId } : null),
    url,
    title,
    referrer: ref,
    ...(identity ? { id: identity } : null),
  };
};

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

  const result = collect({
    type: 'event',
    payload: {
      ...getPayload(),
      ...(isValidString(url) && { url }),
      ...(isValidString(referrer) && { referrer }),
    } satisfies ViewPayload,
  });

  // Consume the landing-page URL referral param after the first tracked view
  // so subsequent SPA navigations don't keep attributing to the same referrer.
  consumeQueryRef();

  return result;
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
  else if (eventName.length > 50) {
    // Umami silently truncates names server-side; warn the developer and
    // truncate here so what we log matches what Umami actually records.
    logger('event-name-length');
    name = eventName.slice(0, 50);
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
 * Save data about the current session and optionally identify the user.
 *
 * Supports three call signatures matching the official Umami tracker:
 * - `umIdentify(uniqueId)` — set a distinct user ID (Umami v2.18.0+)
 * - `umIdentify(uniqueId, sessionData)` — set ID and session data together
 * - `umIdentify(sessionData)` — set session data only (original behaviour)
 *
 * The distinct ID is stored in a module-level closure and automatically
 * included in all subsequent event and pageview payloads, matching the
 * behaviour of the official Umami tracker script.
 *
 * @see [v2.13.0 release](https://github.com/umami-software/umami/releases/tag/v2.13.0)
 * @see [Umami Docs — Identify](https://umami.is/docs/tracker-functions)
 *
 * @param uniqueIdOrData distinct user ID string (max 50 chars) **or** session data object
 * @param sessionData session data when first arg is a distinct ID
 */
function umIdentify(uniqueId: string, sessionData?: EventData): FetchResult;
function umIdentify(sessionData?: EventData): FetchResult;
function umIdentify(
  uniqueIdOrData?: string | EventData,
  sessionData?: EventData,
): FetchResult {
  const check = runPreflight();

  if (check === 'ssr')
    return earlyPromise(false);

  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }

  let id: string | undefined;
  let data: ReturnType<typeof flattenObject>;

  if (typeof uniqueIdOrData === 'string') {
    // umIdentify(uniqueId) or umIdentify(uniqueId, sessionData)
    id = uniqueIdOrData.trim().slice(0, 50) || undefined;
    data = flattenObject(sessionData);
  }
  else {
    // umIdentify(sessionData) — original behaviour
    data = flattenObject(uniqueIdOrData ?? undefined);
  }

  // Persist the distinct ID so all subsequent tracking calls include it,
  // matching the official Umami tracker script's identify() behaviour.
  if (id)
    identifyId = id;

  return collect({
    type: 'identify',
    payload: {
      ...getPayload(),
      ...(id ? { id } : null),
      ...(data ? { data } : null),
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
function umTrackRevenue(
  eventName: string,
  revenue: number,
  currency: CurrencyCode = 'USD',
): FetchResult {
  const $rev = typeof revenue === 'number' ? revenue : Number(revenue);

  if (Number.isNaN($rev) || !Number.isFinite(revenue)) {
    // if you ever run into troubles with isFinite (or not),
    // please buy me a coffee ;) bmc.link/ijkml
    logger('revenue', revenue);
    return earlyPromise(false);
  }

  let $cur: string | null = null;

  if (typeof currency === 'string' && /^[A-Z]{3}$/.test(currency.trim().toUpperCase()))
    $cur = currency.trim().toUpperCase();
  else
    logger('currency', `Got: ${currency}`);

  return umTrackEvent(eventName, {
    revenue: $rev,
    ...($cur ? { currency: $cur } : null),
  });
}

function startPerformanceTracking(): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined')
    return () => {};

  if (runPreflight() !== true)
    return () => {};

  const t0 = performance.now();
  let flushed = false;
  const metrics = { ttfb: 0, fcp: 0, lcp: 0, cls: 0, inp: 0 };

  // TTFB from Navigation Timing API
  const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (nav) {
    const activationStart = (nav as PerformanceNavigationTiming & { activationStart?: number }).activationStart ?? 0;
    metrics.ttfb = Math.max(nav.responseStart - activationStart, 0);
  }

  const observers: PerformanceObserver[] = [];

  function observe(type: string, cb: PerformanceObserverCallback, extra?: Record<string, unknown>) {
    try {
      const obs = new PerformanceObserver(cb);
      obs.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
      observers.push(obs);
    }
    catch { /* entry type unsupported in this browser */ }
  }

  observe('paint', (list) => {
    const entry = list.getEntriesByName('first-contentful-paint')[0];
    if (entry)
      metrics.fcp = entry.startTime;
  });

  observe('largest-contentful-paint', (list) => {
    const entries = list.getEntries();
    if (entries.length)
      metrics.lcp = entries.at(-1)!.startTime;
  });

  let clsSession = 0;
  let clsSessionStart = -1;
  observe('layout-shift', (list) => {
    for (const e of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
      if (e.hadRecentInput)
        continue;
      if (clsSessionStart >= 0 && e.startTime - clsSessionStart < 1000)
        clsSession += e.value;
      else
        clsSession = e.value;
      clsSessionStart = e.startTime;
      if (clsSession > metrics.cls)
        metrics.cls = clsSession;
    }
  });

  observe('event', (list) => {
    for (const e of list.getEntries()) {
      if (e.duration > metrics.inp)
        metrics.inp = e.duration;
    }
  }, { durationThreshold: 40 });

  let timer: ReturnType<typeof setTimeout>;

  function onHide() {
    if (document.visibilityState === 'hidden')
      flush();
  }

  function flush() {
    if (flushed)
      return;
    flushed = true;
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onHide);
    for (const obs of observers) {
      try {
        obs.disconnect();
      }
      catch {}
    }

    collect({
      type: 'performance',
      payload: {
        ...getPayload(),
        ttfb: metrics.ttfb,
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        cls: metrics.cls,
        inp: metrics.inp,
        duration: Math.round(performance.now() - t0),
      } satisfies PerformancePayload,
    });
  }

  timer = setTimeout(flush, 10_000);
  document.addEventListener('visibilitychange', onHide);
  return flush;
}

export { startPerformanceTracking, umIdentify, umTrackEvent, umTrackRevenue, umTrackView };
