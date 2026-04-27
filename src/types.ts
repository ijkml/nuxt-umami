import type { ModuleOptions } from './options';

// !IMPORTANT: Sync with example.ts

interface _NormalizedOpts extends Required<ModuleOptions> {
  domains: Array<string> | null;
  customEndpoint: `/${string}` | null;
  urlOptions: Required<Required<ModuleOptions>['urlOptions']>;
}

type NormalizedModuleOptions = Prettify<
  Omit<
    _NormalizedOpts,
    'excludeQueryParams' | 'trailingSlash'
  >
>;

type _PublicConfig = Omit<
  NormalizedModuleOptions,
  'id' | 'host' | 'proxy' | 'customEndpoint' | 'logErrors'
>;

interface UmPublicConfig extends _PublicConfig {
  website: string;
  endpoint: string;
  /** Determines which collect() implementation to use at runtime */
  mode: ModuleMode;
  logErrors: boolean;
}

interface UmPrivateConfig {
  website: string;
  endpoint: string;
  domains: Array<string> | null;
}

type PreflightResult = true | 'ssr' | 'domain' | 'localhost' | 'local-storage';
type ModuleMode = 'faux' | 'proxy' | 'direct';

type EventData = Record<string, string | number | boolean> | null;

type PayloadTypes = ['event', 'identify', 'performance'];

interface StaticPayload {
  screen: string;
  language: string;
  hostname: string;
  tag?: string;
  /** Distinct user ID set via umIdentify(). Auto-included in all payloads. */
  id?: string;
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
  /** Distinct user ID (max 50 chars). Added in Umami v2.18.0. */
  id?: string;
  data?: Record<string, unknown>;
}

interface PerformancePayload extends ViewPayload {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  inp: number;
  duration: number;
}

interface ServerPayload {
  cache?: string;
  type: PayloadTypes[number];
  payload: ViewPayload | EventPayload | PerformancePayload;
};

type FetchResult = Promise<{ ok: boolean }>;
type FetchFn = (load: ServerPayload) => FetchResult;
type BuildPathUrlFn = (loc: string | null) => string;

type _Letter = `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'
  | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S'
  | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'}`;

type CurrencyCode = Uppercase<`${_Letter}${_Letter}${_Letter}`>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    umami: UmPublicConfig;
  }
  interface RuntimeConfig {
    umami: UmPrivateConfig;
  }
}

export type {
  BuildPathUrlFn,
  CurrencyCode,
  EventData,
  EventPayload,
  FetchFn,
  FetchResult,
  IdentifyPayload,
  ModuleMode,
  NormalizedModuleOptions,
  PayloadTypes,
  PerformancePayload,
  PreflightResult,
  ServerPayload,
  StaticPayload,
  UmPrivateConfig,
  UmPublicConfig,
  ViewPayload,
};
