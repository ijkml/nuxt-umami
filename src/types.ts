interface ModuleOptions {
  /**
   * Your umami endpoint. This is where you would
   * normally load the script from.
   *
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
   * @example 'mywebsite.com, mywebsite2.com'
   * @example ['mywebsite.com', 'mywebsite2.com']
   * @default undefined
   */
  domains?: string | string[] | null;
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
   * Self-hosted Umami lets you set a COLLECT_API_ENDPOINT, which is:
   * - `/api/collect` by default in Umami v1
   * - `/api/send` by default in Umami v2.
   * See Umami [Docs](https://umami.is/docs/environment-variables).
   */
  customEndpoint?: string | null;
  /**
   * Exclude query/search params from tracked urls
   *
   * false: `/page/link?search=product-abc&filter=asc`
   *
   * true: `/page/link`
   *
   * @default false
   */
  excludeQueryParams?: boolean;
  /**
   * Enable `v-umami` directive
   *
   * @default false
   */
  useDirective?: boolean;
  /**
   * Enable warning and error logs in production
   *
   * @default false
   */
  logErrors?: boolean;
  /**
   * API proxy mode (see docs)
   *
   * @default false
   */
  proxy?: false | 'direct' | 'cloak';
  /**
   * Whether to enable the module
   *
   * @default true
   */
  enabled?: boolean;
}

interface NormalizedModuleOptions extends Required<ModuleOptions> {
  domains: Array<string> | null;
  customEndpoint: `/${string}` | null;
}

type _PublicConfig = Omit<
  NormalizedModuleOptions,
  'id' | 'host' | 'proxy' | 'customEndpoint' | 'logErrors'
>;

interface UmPublicConfig extends _PublicConfig {
  website: string;
  endpoint: string;
}

interface UmPrivateConfig {
  website: string;
  endpoint: string;
}

type PreflightResult = true | 'ssr' | 'domain' | 'localhost' | 'local-storage';
type ModuleMode = 'faux' | 'proxy' | 'direct';

type EventData = Record<string, string | number | boolean> | null;

interface StaticPayload {
  screen: string;
  language: string;
  hostname: string;
}

interface ViewPayload extends StaticPayload {
  url: string;
  title: string;
  referrer: string;
};

interface EventPayload extends ViewPayload {
  name: string;
  data?: Record<string, unknown>;
};

interface ServerPayload {
  cache?: string;
  type: string;
  payload: ViewPayload | EventPayload;
};

type FetchResult = Promise<{ ok: boolean }>;
type FetchFn = (load: ServerPayload) => FetchResult;

export type {
  PreflightResult,
  FetchResult,
  ModuleOptions,
  EventData,
  StaticPayload,
  NormalizedModuleOptions,
  UmPublicConfig,
  UmPrivateConfig,
  ModuleMode,
  FetchFn,
  EventPayload,
  ViewPayload,
  ServerPayload,
};
