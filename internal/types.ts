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

interface EventPayload extends BasicPayload {
  event_name: string
  event_data: unknown
}

type PartialPayload = Omit<BasicPayload, 'website'>;
type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'dnt' | 'local' | true;

interface PreflightArgs {
  ignoreDnt?: boolean
  domains?: string
  id?: string
  host?: string
  local?: boolean
}

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
  PartialPayload,
  EventPayload,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightArgs,
  PreflightResult,
  GetPayloadReturn,
};
