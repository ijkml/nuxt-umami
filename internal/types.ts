interface BasicPayload {
  url: string;
  website: string;
  hostname: string;
  screen: string;
  language: string;
  title: string;
  referrer: string;
}

interface EventData {
  [key: string]: string | number | boolean;
}

type EventDetails =
  {
    name: string;
    data?: EventData;
  } | {
    event_name: string;
    event_data?: EventData;
  };

type EventPayload = BasicPayload & EventDetails;
type ViewPayload = BasicPayload;

type PartialPayload = Omit<BasicPayload, 'website'>;
type PayloadType = 'pageview' | 'event';
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'local' | true;

interface ServerPayload {
  type: PayloadType;
  payload: ViewPayload | EventPayload;
}

export type {
  EventData,
  PartialPayload,
  EventPayload,
  ViewPayload,
  PayloadType,
  ServerPayload,
  PreflightResult,
};
