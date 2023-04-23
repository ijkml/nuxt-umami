interface BasicPayload {
  url: string
  website: string
  hostname: string
  screen: string
  language: string
  title?: string
}

interface ViewPayload extends BasicPayload {
  referrer: string
}

interface EventData {
  [key: string]: string | number | boolean
}

interface EventPayloadV1 extends BasicPayload {
  event_name: string
  event_data?: EventData
}

interface EventPayloadV2 extends BasicPayload {
  referrer: string
  name: string
  data?: EventData
}

type PartialPayload = Omit<BasicPayload, 'website'>;
type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'dnt' | 'local' | 'v2' | true;

interface ServerPayload {
  type: PayloadType
  payload: ViewPayload | EventPayloadV1 | EventPayloadV2
}

interface GetPayloadReturn {
  payload: PartialPayload
  pageUrl: string
  pageReferrer: string
}

export {
  EventData,
  PartialPayload,
  EventPayloadV1,
  EventPayloadV2,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightResult,
  GetPayloadReturn,
};
