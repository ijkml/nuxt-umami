function warnMock() {
  if (process.client && process.env.NODE_ENV !== "production") {
    console.warn("You are using Umami before it is ready. $umami is only available `onMounted`");
  }
}
export function useMock() {
  const trackEvent = (eventValue, eventType, url, websiteId) => warnMock();
  const trackView = (url, referer, websiteId) => warnMock();
  const umami = (eventValue) => trackEvent(eventValue);
  umami.trackView = trackView;
  umami.trackEvent = trackEvent;
  return umami;
}
export function loadScript(src, attrs) {
  const document = typeof window !== "undefined" ? window.document : void 0;
  const _attrs = attrs || {};
  let _promise = null;
  const loadScript2 = () => new Promise((resolve, reject) => {
    const resolveWithElement = (el2) => {
      resolve(el2);
      return el2;
    };
    if (!document) {
      resolve(false);
      return;
    }
    let shouldAppend = false;
    let el = document.querySelector(`script[src="${src}"]`);
    if (!el) {
      el = document.createElement("script");
      el.type = "text/javascript";
      el.async = true;
      el.defer = true;
      el.src = src;
      Object.entries(_attrs).forEach(([name, value]) => el?.setAttribute(name, value));
      shouldAppend = true;
    } else if (el.hasAttribute("data-loaded")) {
      resolveWithElement(el);
    }
    el.addEventListener("error", (event) => reject(event));
    el.addEventListener("abort", (event) => reject(event));
    el.addEventListener("load", () => {
      el.setAttribute("data-loaded", "true");
      resolveWithElement(el);
    });
    if (shouldAppend) {
      el = document.head.appendChild(el);
    }
  });
  const load = () => {
    if (!_promise) {
      _promise = loadScript2();
    }
    return _promise;
  };
  return { load };
}
