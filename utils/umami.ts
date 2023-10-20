import { collect, getPayload, helloDebugger, isValidString, preflight, umConfig } from '../internal/utils';
import type { EventData, EventPayload, ViewPayload } from '../internal/types';

/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param url page being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referrer page referrer, `document.referrer`
 */
function trackView(url?: string, referrer?: string): void {
  const check = preflight.value;

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger.value(`err-${check}`);
    return;
  }

  const { id: website, version } = umConfig.value;
  const { pageReferrer, pageUrl, payload } = getPayload.value;

  void collect(
    {
      type: version === 2 ? 'event' : 'pageview',
      payload: {
        ...payload,
        url: isValidString(url) ? url : pageUrl,
        referrer: isValidString(referrer) ? referrer : pageReferrer,
        website,
      } satisfies ViewPayload,
    },
  );
}

/**
 * Tracks an event with a custom event type.
 *
 * @param eventName event name, eg 'CTA-button-click'
 * @param eventData additional data for the event, provide an object in the format
 * `{key: value}`, `key` = string, `value` = string | number | boolean.
 */
function trackEvent(eventName: string, eventData?: EventData) {
  const check = preflight.value;

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger.value(`err-${check}`);
    return;
  }

  const { id: website, version } = umConfig.value;
  const { payload } = getPayload.value;

  let name = eventName;

  if (!isValidString(eventName)) {
    helloDebugger.value('err-event-name');
    name = '#unknown-event';
  }

  const data = (eventData !== null && typeof eventData === 'object')
    ? eventData
    : undefined;

  const eventObj = version === 2
    ? {
        name,
        data,
      }
    : {
        event_name: name,
        event_data: data,
      };

  void collect({
    type: 'event',
    payload: {
      ...payload,
      ...eventObj,
      website,
    } satisfies EventPayload,
  });
}

export { trackEvent as umTrackEvent, trackView as umTrackView };
