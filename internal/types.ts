interface BasicPayload {
  url: string
  website: string
  hostname: string
  screen: string
  language: string
}

interface ViewPayload extends BasicPayload {
  referrer: string
}

interface EventData {
  [key: string]: string | number | boolean
}

interface EventPayload extends BasicPayload {
  event_name: string
  event_data?: EventData
}

type PartialPayload = Omit<BasicPayload, 'website'>;
type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'dnt' | 'local' | 'v2' | true;

interface ServerPayload {
  type: PayloadType
  payload: ViewPayload | EventPayload
}

interface GetPayloadReturn {
  payload: PartialPayload
  pageUrl: string
  pageReferrer: string
}

export {
  EventData,
  PartialPayload,
  EventPayload,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightResult,
  GetPayloadReturn,
};
