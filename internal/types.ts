interface BasicPayload {
  url: string
  website: string
  hostname: string
  screen: string
  language: string
  title: string
  referrer: string
}

interface EventData {
  [key: string]: string | number | boolean
}

type EventPayloadPartial =
  {
    name: string
    data?: EventData
  } | {
    event_name: string
    event_data?: EventData
  };

  type EventPayload = BasicPayload & EventPayloadPartial;
  type ViewPayload = BasicPayload;

type PartialPayload = Omit<BasicPayload, 'website'>;
type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'dnt' | 'local' | true;

interface ServerPayload {
  type: PayloadType
  payload: ViewPayload | EventPayload
}

interface GetPayloadReturn {
  payload: PartialPayload
  pageUrl: string
  pageReferrer: string
}

export type {
  EventData,
  PartialPayload,
  EventPayload,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightResult,
  GetPayloadReturn,
};
