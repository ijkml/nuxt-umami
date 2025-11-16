import type { CurrencyCode, EventData, FetchResult } from '../types.js';
/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param path url being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referrer page referrer, `document.referrer`
 */
declare function umTrackView(path?: string, referrer?: string): FetchResult;
/**
 * Tracks an event with a custom event type.
 *
 * @param eventName event name, eg 'CTA-button-click'
 * @param eventData additional data for the event, provide an object in the format
 * `{key: value}`, where `key` = `string`, `value` = `string | number | boolean`.
 */
declare function umTrackEvent(eventName: string, eventData?: EventData): FetchResult;
/**
 * Save data about the current session with optional distinct user ID.
 *
 * Umami supports saving session data and identifying users with a distinct ID.
 * @see [v2.13.0 release](https://github.com/umami-software/umami/releases/tag/v2.13.0)
 * @see [v2.18.0 distinct IDs](https://github.com/umami-software/umami/releases/tag/v2.18.0)
 *
 * @param idOrData distinct user ID (string) or session data object
 * @param sessionData optional session data when first param is a distinct ID
 *
 * @example
 * // ID only
 * umIdentify('user@example.com')
 *
 * // ID with data
 * umIdentify('user@example.com', { name: 'John', plan: 'pro' })
 *
 * // Data only (backward compatible)
 * umIdentify({ name: 'John', plan: 'pro' })
 */
declare function umIdentify(idOrData?: string | EventData, sessionData?: EventData): FetchResult;
/**
 * Tracks financial performance
 * @see [Umami Docs](https://umami.is/docs/reports/report-revenue)
 *
 * @param eventName [revenue] event name
 * @param revenue revenue / amount
 * @param currency currency code (defaults to USD)
 * ([ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes))
 */
declare function umTrackRevenue(eventName: string, revenue: number, currency?: CurrencyCode): FetchResult;
export { umIdentify, umTrackEvent, umTrackRevenue, umTrackView };
