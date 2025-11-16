import { buildPathUrl, collect, config, logger } from "#build/umami.config.mjs";
import { earlyPromise, flattenObject, isValidString } from "./utils.js";
let configChecks;
let staticPayload;
let queryRef;
let identity;
function runPreflight() {
  if (typeof window === "undefined")
    return "ssr";
  if (window.localStorage.getItem("umami.disabled") === "1")
    return "local-storage";
  if (configChecks)
    return configChecks;
  configChecks = function() {
    const { ignoreLocalhost, domains } = config;
    const hostname = window.location.hostname;
    if (ignoreLocalhost && hostname === "localhost")
      return "localhost";
    if (domains && !domains.includes(hostname))
      return "domain";
    return true;
  }();
  return configChecks;
}
;
function getStaticPayload() {
  if (staticPayload)
    return staticPayload;
  const {
    location: { hostname },
    screen: { width, height },
    navigator: { language }
  } = window;
  const { tag } = config;
  staticPayload = {
    hostname,
    language,
    screen: `${width}x${height}`,
    ...tag ? { tag } : null
  };
  return staticPayload;
}
function getQueryRef() {
  if (typeof queryRef === "string")
    return queryRef;
  const params = new URL(window.location.href).searchParams;
  queryRef = params.get("referrer") || params.get("ref") || "";
  return queryRef;
}
function getPayload() {
  const { referrer, title } = window.document;
  const { origin, href } = window.location;
  const url = buildPathUrl(href);
  const tag = window.localStorage.getItem("umami.tag");
  const ref = referrer && !referrer.startsWith(origin) ? referrer : getQueryRef();
  return {
    ...getStaticPayload(),
    ...tag ? { tag } : null,
    url,
    title,
    referrer: ref,
    ...identity ? { id: identity } : null
  };
}
;
function umTrackView(path, referrer) {
  const check = runPreflight();
  if (check === "ssr")
    return earlyPromise(false);
  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }
  const url = buildPathUrl(isValidString(path) ? path : null);
  return collect({
    type: "event",
    payload: {
      ...getPayload(),
      ...isValidString(url) && { url },
      ...isValidString(referrer) && { referrer }
    }
  });
}
function umTrackEvent(eventName, eventData) {
  const check = runPreflight();
  if (check === "ssr")
    return earlyPromise(false);
  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }
  const data = flattenObject(eventData);
  let name = eventName;
  if (!isValidString(eventName)) {
    logger("event-name");
    name = "#unknown-event";
  }
  return collect({
    type: "event",
    payload: {
      name,
      ...getPayload(),
      ...data && { data }
    }
  });
}
function umIdentify(idOrData, sessionData) {
  const check = runPreflight();
  if (check === "ssr")
    return earlyPromise(false);
  if (check !== true) {
    logger(check);
    return earlyPromise(false);
  }
  let id;
  let data;
  if (typeof idOrData === "string") {
    id = idOrData;
    identity = idOrData;
    data = flattenObject(sessionData);
  } else {
    data = flattenObject(idOrData);
  }
  return collect({
    type: "identify",
    payload: {
      ...getPayload(),
      ...id && { id },
      ...data && { data }
    }
  });
}
function umTrackRevenue(eventName, revenue, currency = "USD") {
  const $rev = typeof revenue === "number" ? revenue : Number(revenue);
  if (Number.isNaN($rev) || !Number.isFinite(revenue)) {
    logger("revenue", revenue);
    return earlyPromise(false);
  }
  let $cur = null;
  if (typeof currency === "string" && /^[A-Z]{3}$/i.test(currency.trim()))
    $cur = currency.trim();
  else
    logger("currency", `Got: ${currency}`);
  return umTrackEvent(eventName, {
    revenue: $rev,
    ...$cur ? { currency: $cur } : null
  });
}
export { umIdentify, umTrackEvent, umTrackRevenue, umTrackView };
