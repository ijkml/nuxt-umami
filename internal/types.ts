interface BasicPayload {
  website: string
  url: string
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

type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'domain' | 'dnt' | true;

interface PreflightArgs {
  websiteId?: string
  ignoreDnt?: boolean
  domains?: string
}

interface ServerPayload {
  type: PayloadType
  payload: ViewPayload | EventPayload
}

interface GetPayloadReturn {
  payload: BasicPayload
  pageUrl: string
  pageReferrer: string
}

export {
  BasicPayload,
  EventPayload,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightArgs,
  PreflightResult,
  GetPayloadReturn,
};
