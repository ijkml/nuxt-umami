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
  website?: string;
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
type BuildPathUrlFn = (loc: string | null) => string;

type _Letter = `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
  | 'I' | 'J' | 'K' | 'M' | 'L' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S'
  | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'}`;

type CurrencyCode = Uppercase<`${_Letter}${_Letter}${_Letter}`>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

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
  PreflightResult,
  ServerPayload,
  StaticPayload,
  UmPrivateConfig,
  UmPublicConfig,
  ViewPayload,
};
