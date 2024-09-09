interface ModuleOptions {
  /**
   * Your umami endpoint. This is where you would
   * normally load the script from.
   * @required true
   * @example 'https://ijkml.xyz/'
   */
  host?: string;
  /**
   * Unique identifier provided by Umami
   *
   * @required true
   * @example `3c255b6d-678a-42dd-8074-272ee5b78484`
   */
  id?: string;
  /**
   * Configure the tracker to only run on specific domains.
   * Provide an array or comma delimited list of domains (without 'http').
   * Leave as `undefined` to run on all domains.
   *
   * @example `mywebsite.com, mywebsite2.com`
   * @example ['mywebsite.com', 'mywebsite2.com']
   * @default undefined
   */
  domains?: string | string[];
  /**
   * @deprecated
   * This option has been deprecated and is
   * just here for compatibility.
   */
  ignoreDnt?: boolean;
  /**
   * Option to automatically track page views.
   *
   * @default true
   */
  autoTrack?: boolean;
  /**
   * Whether or not to track during development (localhost).
   *
   * @default false
   */
  ignoreLocalhost?: boolean;
  /**
   * Version of Umami used, either `1.x.x` or `2.x.x`
   *
   * @default 1
   */
  version?: 1 | 2;
  /**
   * Self-hosted Umami lets you set a COLLECT_API_ENDPOINT, which is:
   * - `/api/collect` by default in Umami v1
   * - `/api/send` by default in Umami v2. See Umami [Docs](https://umami.is/docs/environment-variables).
   */
  customEndpoint?: `/${string}`;
  /**
   * Enable `v-umami` directive
   *
   * @default false
   */
  useDirective?: boolean;
  /**
   * Enable warning and error logs in prod
   *
   * @default false
   */
  debug?: boolean;
}

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
type PreflightResult = 'ssr' | 'id' | 'host' | 'domain' | 'localhost' | 'local-storage' | true;

interface ServerPayload {
  type: PayloadType;
  payload: ViewPayload | EventPayload;
}

type FetchResult = Promise<{ ok: boolean }>;

export type {
  EventData,
  EventPayload,
  FetchResult,
  ModuleOptions,
  PartialPayload,
  PayloadType,
  PreflightResult,
  ServerPayload,
  ViewPayload,
};
