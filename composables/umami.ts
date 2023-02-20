import { assert, getPayload, preflight } from '../internal/utils';
import type { EventPayload, ServerPayload, ViewPayload } from '../internal/types';
import { helloDebugger } from '../internal/debug';

async function collect(load: ServerPayload) {
  $fetch('/api/umami', {
    method: 'POST',
    body: load,
  })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info('SUCCESS');
    })
    .catch(() => {
      // helloDebugger('collect-error');
      console.error('Collect error');
    });
}

/**
 * Track page views
 *
 * Both params are optional and will be automatically inferred
 * @param url page being tracked, eg `/about`, `/contact?by=phone#office`
 * @param referer page referrer, `document.referrer`
 */
function trackView(url: string, referrer: string): void {
  const { umami: { websiteId, domains, ignoreDnt = false } = {} } = useAppConfig();

  const check = preflight({ domains, ignoreDnt, websiteId });

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger(`err-${check}`);
    return;
  }

  assert(typeof websiteId === 'string');

  const { pageReferrer, pageUrl, payload } = getPayload(websiteId);

  void collect(
    {
      type: 'pageview',
      payload: {
        ...payload,
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
 * @param eventData additional data for the event, could be `string`/`object`/`array`
 */
function trackEvent(eventName: string, eventData?: string | number | object) {
  const { umami: { websiteId, domains, ignoreDnt = false } = {} } = useAppConfig();

  const check = preflight({ domains, ignoreDnt, websiteId });

  if (check === 'ssr') {
    return;
  }

  if (check !== true) {
    helloDebugger(`err-${check}`);
    return;
  }

  assert(typeof websiteId === 'string');

  const { payload } = getPayload(websiteId);
  const name = eventName || '#unknown-event';
  let data;

  try {
    data = JSON.stringify(eventData);
  } catch {
    data = undefined;
  }

  void collect({
    type: 'event',
    payload: {
      ...payload,
      event_name: name,
      event_data: data,
    } satisfies EventPayload,
  });
}

export { trackEvent, trackView };
