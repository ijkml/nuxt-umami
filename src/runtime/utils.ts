import type {
  EventPayload,
  FetchResult,
  ModuleOptions,
  NormalizedModuleOptions,
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
  } = options;

  return {
    host: isValidString(host) && URL.canParse(host) ? host.trim() : '',
    id: isValidString(id) ? id.trim() : '',
    domains: (function () {
      let res = null;
      if (Array.isArray(domains) && domains.length)
        res = domains.filter(isValidString).map(d => d.trim());
      else if (isValidString(domains))
        res = domains.split(',').filter(isValidString).map(d => d.trim());
      return res ? Array.from(new Set(res)) : null;
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

const _propsValidator = {
  nonempty: isValidString,
  string: (value: unknown) => typeof value === 'string',
  data: (value: unknown) => isRecord(value, true),
  skip: () => true,
} as const;

type PropertyValidator = keyof typeof _propsValidator;
type Payload = ViewPayload & EventPayload;

const _payloadProps: Record<keyof Payload, PropertyValidator> = {
  hostname: 'nonempty',
  language: 'nonempty',
  screen: 'nonempty',
  url: 'nonempty',
  referrer: 'string',
  title: 'string',
  name: 'skip', // optional, 'nonempty' in EventPayload
  data: 'skip', // optional, 'data' in EventPayload
} as const;

const _bodyProps: Array<keyof ServerPayload> = ['cache', 'payload', 'type'];

function isValidPayload(obj: object): obj is Payload {
  if (!isRecord(obj))
    return false;

  const objKeys = Object.keys(obj);

  const validators: typeof _payloadProps = { ..._payloadProps };

  const validatorKeys: Array<keyof Payload> = [
    'hostname', 'language', 'screen',
    'url', 'referrer', 'title',
  ];

  if (objKeys.includes('name')) {
    // is event payload, update validators
    validatorKeys.push('name');
    validators.name = 'nonempty';

    // optional data is present, update validators
    if (objKeys.includes('data')) {
      validatorKeys.push('data');
      validators.data = 'data';
    }
  }

  // check: all keys are present, no more, no less
  if (
    objKeys.length !== validatorKeys.length
    || !validatorKeys.every(k => objKeys.includes(k))
  ) return false;

  // run each value against its validator
  for (const key in obj) {
    const fn = _propsValidator[validators[key as keyof Payload]];
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

function parseCollectBody(body: unknown): ValidatePayloadReturn {
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
  )) return error;

  const { payload, cache, type } = body;

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
  isValidString,
  flattenObject,
  normalizeConfig,
  parseCollectBody,
};
