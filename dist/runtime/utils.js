function earlyPromise(ok) {
  return Promise.resolve({ ok });
}
function isRecord(value, optional = false) {
  if (optional && value === void 0)
    return true;
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
function isValidString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function includes(arr, el) {
  return arr.includes(el);
}
function normalizeConfig(options = {}) {
  const {
    host = "",
    id = "",
    domains = null,
    customEndpoint = null,
    proxy = false,
    ignoreLocalhost = false,
    autoTrack = true,
    useDirective = false,
    logErrors = false,
    enabled = true,
    tag = void 0,
    excludeQueryParams = false,
    trailingSlash = "any",
    urlOptions
  } = options;
  return {
    host: isValidString(host) && URL.canParse(host) ? host.trim() : "",
    id: isValidString(id) ? id.trim() : "",
    domains: function() {
      if (Array.isArray(domains) && domains.length)
        return Array.from(domains.filter(isValidString).map((d) => d.trim()));
      return null;
    }(),
    customEndpoint: function() {
      const customEP = isValidString(customEndpoint) ? customEndpoint.trim() : "";
      return customEP && customEP !== "/" ? customEP.startsWith("/") ? customEP : `/${customEP}` : null;
    }(),
    proxy: function() {
      if (isValidString(proxy) && ["direct", "cloak"].includes(proxy.trim()))
        return proxy.trim();
      return false;
    }(),
    urlOptions: {
      trailingSlash: function() {
        const opt = urlOptions?.trailingSlash ?? trailingSlash;
        if (isValidString(opt) && ["always", "never"].includes(opt.trim()))
          return opt.trim();
        return "any";
      }(),
      excludeSearch: (urlOptions?.excludeSearch ?? excludeQueryParams) === true,
      excludeHash: urlOptions?.excludeHash === true
    },
    tag: isValidString(tag) ? tag.trim() : null,
    ignoreLocalhost: ignoreLocalhost === true,
    autoTrack: autoTrack !== false,
    useDirective: useDirective === true,
    logErrors: logErrors === true,
    enabled: enabled !== false
  };
}
function flattenObject(obj, prefix = "") {
  try {
    if (typeof obj !== "object" || obj === null)
      throw new TypeError(`Not an object.`);
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? `${prefix}.` : "";
      if (typeof obj[k] === "object" && obj[k] !== null && Object.keys(obj[k]).length > 0) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  } catch {
    return void 0;
  }
}
const validatorFns = {
  nonempty: isValidString,
  string: (value) => typeof value === "string",
  data: (value) => isRecord(value, true),
  skip: () => true
};
const _payloadProps = {
  hostname: "nonempty",
  language: "nonempty",
  screen: "nonempty",
  url: "nonempty",
  referrer: "string",
  title: "string",
  tag: "skip",
  // optional property
  name: "skip",
  // optional, 'nonempty' in EventPayload
  data: "skip"
  // optional, 'data' in EventPayload & IdentifyPayload
};
const _payloadType = ["event", "identify"];
const _bodyProps = ["cache", "payload", "type"];
function isValidPayload(obj) {
  if (!isRecord(obj))
    return false;
  const objKeys = Object.keys(obj);
  const validators = { ..._payloadProps };
  const validatorKeys = [
    "hostname",
    "language",
    "screen",
    "url",
    "referrer",
    "title"
  ];
  if (objKeys.includes("name")) {
    validatorKeys.push("name");
    validators.name = "nonempty";
  }
  if (objKeys.includes("data")) {
    validatorKeys.push("data");
    validators.data = "data";
  }
  if (objKeys.includes("tag")) {
    validatorKeys.push("tag");
    validators.tag = "string";
  }
  if (objKeys.length !== validatorKeys.length || !validatorKeys.every((k) => objKeys.includes(k))) {
    return false;
  }
  for (const key in obj) {
    const fn = validatorFns[validators[key]];
    const value = obj[key];
    if (fn(value))
      continue;
    return false;
  }
  return true;
}
function parseEventBody(body) {
  const error = {
    success: false,
    output: body
  };
  if (!isRecord(body) || Object.keys(body).length !== _bodyProps.length)
    return error;
  if (!("type" in body && isValidString(body.type) && "cache" in body && typeof body.cache === "string" && "payload" in body && isRecord(body.payload))) {
    return error;
  }
  const { payload, cache, type } = body;
  if (!includes(_payloadType, type))
    return error;
  if (!isValidPayload(payload))
    return error;
  return {
    success: true,
    output: { type, cache, payload }
  };
}
export {
  earlyPromise,
  flattenObject,
  isValidString,
  normalizeConfig,
  parseEventBody
};
