type ModuleOptions = Partial<{
  /**
   * Whether to enable the module
   *
   * @default true
   */
  enabled: boolean;
  /**
   * Your umami endpoint. This is where you would
   * normally load the script from.
   *
   * @required true
   * @example 'https://ijkml.xyz/'
   * @see [How to find?](https://umami.nuxt.dev/api/configuration#finding-config-options).
   */
  host: string;
  /**
   * Unique identifier provided by Umami
   *
   * @required true
   * @example `3c255b6d-678a-42dd-8074-272ee5b78484`
   */
  id: string;
  /**
   * Configure the tracker to only run on specific domains.
   * Provide an array or comma delimited list of domains (without 'http').
   * Leave as `undefined` to run on all domains.
   *
   * @example 'mywebsite.com, mywebsite2.com'
   * @example ['mywebsite.com', 'mywebsite2.com']
   * @default undefined
   */
  domains: string[] | null;
  /**
   * Option to automatically track page views.
   *
   * @default true
   */
  autoTrack: boolean;
  /**
   * Whether or not to track during development (localhost).
   *
   * @default false
   */
  ignoreLocalhost: boolean;
  /**
   * Self-hosted Umami lets you set a COLLECT_API_ENDPOINT, which is:
   * - `/api/collect` by default in Umami v1
   * - `/api/send` by default in Umami v2.
   * See [Umami Docs](https://umami.is/docs/environment-variables).
   */
  customEndpoint: string | null;
  /**
   * Use Umami tags for A/B testing or to group events.
   *
   * See [Umami Docs](https://umami.is/docs/tags).
   */
  tag: string | null;
  /**
   * Exclude query/search params from tracked urls
   *
   * false: `/page/link?search=product-abc&filter=asc`
   *
   * true: `/page/link`
   *
   * @default false
   */
  excludeQueryParams: boolean;
  /**
   * Enable `v-umami` directive
   *
   * @default false
   */
  useDirective: boolean;
  /**
   * Enable warning and error logs in production
   *
   * @default false
   */
  logErrors: boolean;
  /**
   * API proxy mode
   *
   * @see [Documentation](https://umami.nuxt.dev/api/configuration#proxy-mode).
   *
   * @default false
   */
  proxy: false | 'direct' | 'cloak';
  /**
   * Consistent trailing slash
   *
   * @default 'any'
   */
  trailingSlash: 'any' | 'always' | 'never';
}>;

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

type PayloadTypes = ['event', 'identify'];

interface StaticPayload {
  screen: string;
  language: string;
  hostname: string;
  tag?: string;
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

interface IdentifyPayload extends ViewPayload {
  data?: Record<string, unknown>;
}

interface ServerPayload {
  cache?: string;
  type: PayloadTypes[number];
  payload: ViewPayload | EventPayload;
};

type FetchResult = Promise<{ ok: boolean }>;
type FetchFn = (load: ServerPayload) => FetchResult;
type BuildPathUrlFn = () => string;

type _Letter = `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
| 'I' | 'J' | 'K' | 'M' | 'L' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S'
| 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'}`;

type CurrencyCode = Uppercase<`${_Letter}${_Letter}${_Letter}`>;

export type {
  BuildPathUrlFn,
  CurrencyCode,
  EventData,
  EventPayload,
  FetchFn,
  FetchResult,
  IdentifyPayload,
  ModuleMode,
  ModuleOptions,
  NormalizedModuleOptions,
  PayloadTypes,
  PreflightResult,
  ServerPayload,
  StaticPayload,
  UmPrivateConfig,
  UmPublicConfig,
  ViewPayload,
};
