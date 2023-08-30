interface BasicPayload {
  url: string
  website: string
  hostname: string
  screen: string
  language: string
  title: string
  referrer: string
}

export interface EventData {
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

export type EventPayload = BasicPayload & EventPayloadPartial;
export type ViewPayload = BasicPayload;

export type PartialPayload = Omit<BasicPayload, 'website'>;
export type PayloadType = 'pageview' | 'event';
export type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'dnt' | 'local' | true;

export interface ServerPayload {
  type: PayloadType
  payload: ViewPayload | EventPayload
}

export interface GetPayloadReturn {
  payload: PartialPayload
  pageUrl: string
  pageReferrer: string
}
