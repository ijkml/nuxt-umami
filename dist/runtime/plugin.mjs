import { defineNuxtPlugin } from "#app";
import { loadScript, useMock } from "./helpers.mjs";
export default defineNuxtPlugin(async (nuxtApp) => {
  const options = { ...nuxtApp.payload.config.public.umami };
  const { scriptUrl, websiteId, autoTrack, cache, doNotTrack, domains } = options;
  const attrs = {
    "data-website-id": websiteId
  };
  if (typeof autoTrack === "boolean") {
    attrs["data-auto-track"] = autoTrack;
  }
  if (typeof cache === "boolean") {
    attrs["data-cache"] = cache;
  }
  if (typeof doNotTrack === "boolean") {
    attrs["data-do-not-track"] = doNotTrack;
  }
  if (typeof domains === "string") {
    attrs["data-domains"] = domains;
  }
  const mockUmami = useMock();
  let umami = mockUmami;
  if (process.client) {
    await loadScript(scriptUrl, attrs).load().then((resolved) => {
      if (resolved !== false && window.umami) {
        umami = window.umami;
      }
    }).catch((err) => {
      console.error("An error occured, could not load Umami", err);
    });
  }
  return {
    provide: {
      umami
    }
  };
});
