import type {
  EventPayload,
  FetchResult,
  ModuleOptions,
  NormalizedModuleOptions,
  PayloadTypes,
  ServerPayload,
  ViewPayload,
} from '../types';

function earlyPromise(ok: boolean): FetchResult {
  return Promise.resolve({ ok });
}

function isRecord(value: unknown, optional = false): value is Record<string, unknown> {
  if (optional && value === undefined)
    return true;
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function includes<T extends U, U>(arr: ReadonlyArray<T>, el: U): el is T {
  return arr.includes(el as T);
}

function normalizeConfig(options: ModuleOptions = {}): NormalizedModuleOptions {
  const {
    host = '',
    id = '',
    domains = null,
    customEndpoint = null,
    proxy = false,
    ignoreLocalhost = false,
    autoTrack = true,
    useDirective = false,
    excludeQueryParams = false,
    logErrors = false,
    enabled = true,
    trailingSlash = 'any',
  } = options;

  return {
    host: isValidString(host) && URL.canParse(host) ? host.trim() : '',
    id: isValidString(id) ? id.trim() : '',
    domains: (function () {
      if (Array.isArray(domains) && domains.length)
        return Array.from(domains.filter(isValidString).map(d => d.trim()));
      return null;
    })(),
    customEndpoint: (function () {
      const customEP = isValidString(customEndpoint) ? customEndpoint.trim() : '';
      return (customEP && customEP !== '/')
        ? customEP.startsWith('/')
          ? customEP as `/${string}`
          : `/${customEP}`
        : null;
    })(),
    proxy: (function () {
      if (isValidString(proxy) && ['direct', 'cloak'].includes(proxy.trim()))
        return proxy.trim() as typeof proxy;
      return false;
    })(),
    trailingSlash: (function () {
      if (
        isValidString(trailingSlash)
        && ['always', 'never'].includes(trailingSlash.trim())
      ) {
        return trailingSlash.trim() as typeof trailingSlash;
      }
      return 'any';
    })(),
    ignoreLocalhost: ignoreLocalhost === true,
    autoTrack: autoTrack !== false,
    useDirective: useDirective === true,
    excludeQueryParams: excludeQueryParams === true,
    logErrors: logErrors === true,
    enabled: enabled !== false,
  };
}

function flattenObject(obj?: Record<string, unknown> | null, prefix = '') {
  try {
    if (typeof obj !== 'object' || obj === null)
      throw new TypeError(`Not an object.`);

    return Object.keys(obj).reduce((acc: Record<string, unknown>, k) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (
        typeof obj[k] === 'object'
        && obj[k] !== null
        && Object.keys(obj[k]).length > 0
      ) {
        Object.assign(acc, flattenObject(obj[k] as Record<string, unknown>, pre + k));
      }
      else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  }
  catch {
    return undefined;
  }
}

const validatorFns = {
  nonempty: isValidString,
  string: (value: unknown) => typeof value === 'string',
  data: (value: unknown) => isRecord(value, true),
  skip: () => true,
} as const;

type PropertyValidator = keyof typeof validatorFns;
type Payload = ViewPayload & EventPayload;

const _payloadProps: Record<keyof Payload, PropertyValidator> = {
  hostname: 'nonempty',
  language: 'nonempty',
  screen: 'nonempty',
  url: 'nonempty',
  referrer: 'string',
  title: 'string',
  name: 'skip', // optional, 'nonempty' in EventPayload
  data: 'skip', // optional, 'data' in EventPayload & IdentifyPayload
} as const;

const _payloadType: PayloadTypes = ['event', 'identify'];
const _bodyProps: Array<keyof ServerPayload> = ['cache', 'payload', 'type'];

function isValidPayload(obj: object): obj is Payload {
  if (!isRecord(obj))
    return false;

  const objKeys = Object.keys(obj);

  const validators: typeof _payloadProps = { ..._payloadProps };

  const validatorKeys: Array<keyof Payload> = [
    'hostname',
    'language',
    'screen',
    'url',
    'referrer',
    'title',
  ];

  if (objKeys.includes('name')) {
    // is EventPayload, update validators
    validatorKeys.push('name');
    validators.name = 'nonempty';
  }

  // optional data is present, update validators
  if (objKeys.includes('data')) {
    validatorKeys.push('data');
    validators.data = 'data';
  }

  // check: all keys are present, no more, no less
  if (
    objKeys.length !== validatorKeys.length
    || !validatorKeys.every(k => objKeys.includes(k))
  ) {
    return false;
  }

  // run each value against its validator
  for (const key in obj) {
    const fn = validatorFns[validators[key as keyof Payload]];
    const value = obj[key];
    if (fn(value))
      continue;
    return false;
  }
  return true;
}

type ValidatePayloadReturn =
  | { success: true; output: ServerPayload }
  | { success: false; output: unknown };

function parseEventBody(body: unknown): ValidatePayloadReturn {
  const error = {
    success: false,
    output: body,
  } satisfies ValidatePayloadReturn;

  // check: is record, no extra keys
  if (!isRecord(body) || Object.keys(body).length !== _bodyProps.length)
    return error;

  // check: top-level properties
  if (!(
    'type' in body && isValidString(body.type)
    && 'cache' in body && typeof body.cache === 'string'
    && 'payload' in body && isRecord(body.payload)
  )) {
    return error;
  }

  const { payload, cache, type } = body;

  if (!includes(_payloadType, type))
    return error;

  // check: body.payload is valid
  if (!isValidPayload(payload))
    return error;

  return {
    success: true,
    output: { type, cache, payload },
  };
}

export {
  earlyPromise,
  flattenObject,
  isValidString,
  normalizeConfig,
  parseEventBody,
};
