import { collect, getPayload, preflight, umConfig } from '../internal/utils';
import type { EventData, EventPayload, ViewPayload } from '../internal/types';
import { helloDebugger } from '../internal/debug';

/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param url page being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referer page referrer, `document.referrer`
 */
function trackView(url?: string, referrer?: string): void {
  const check = preflight.value;

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger(`err-${check}`);
    return;
  }

  const { id } = umConfig.value;
  const { pageReferrer, pageUrl, payload } = getPayload.value;

  void collect(
    {
      type: 'pageview',
      payload: {
        ...payload,
        website: id,
        url: url || pageUrl,
        referrer: referrer || pageReferrer,
      } satisfies ViewPayload,
    },
  );
}

/**
 * Tracks an event with a custom event type.
 *
 * @param eventName event name, eg 'CTA-button-3-clcik'
 * @param eventData additional data for the event, provide an object in the format `{key: value}`, `key` = string, `value` = string | number | or boolean.
 */
function trackEvent(eventName: string, eventData?: EventData) {
  const check = preflight.value;

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger(`err-${check}`);
    return;
  }

  const { id } = umConfig.value;
  const { payload } = getPayload.value;

  const name = eventName || '#unknown-event';

  const data = (eventData !== null && typeof eventData === 'object')
    ? eventData
    : undefined;

  void collect({
    type: 'event',
    payload: {
      ...payload,
      website: id,
      event_name: name,
      event_data: data,
    } satisfies EventPayload,
  });
}

export { trackEvent as umTrackEvent, trackView as umTrackView };
