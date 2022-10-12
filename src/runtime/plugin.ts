import { defineNuxtPlugin } from '#app';
import type { ModuleOptions, Umami } from '../types';
import { loadScript, useMock } from './helpers';

export default defineNuxtPlugin(async (nuxtApp) => {
  const options: ModuleOptions = { ...nuxtApp.payload.config.public.umami };

  const { scriptUrl, websiteId, autoTrack, cache, doNotTrack, domains } = options;

  const attrs = {
    'data-website-id': websiteId,
  };

  // typecheck to strip unneeded attrs

  if (typeof autoTrack === 'boolean') {
    attrs['data-auto-track'] = autoTrack;
  }

  if (typeof cache === 'boolean') {
    attrs['data-cache'] = cache;
  }

  if (typeof doNotTrack === 'boolean') {
    attrs['data-do-not-track'] = doNotTrack;
  }

  if (typeof domains === 'string') {
    attrs['data-domains'] = domains;
  }

  const mockUmami = useMock();
  let umami: Umami = mockUmami;

  if (process.client) {
    await loadScript(scriptUrl, attrs)
      .load()
      .then((resolved) => {
      // register on successful load,
        if (resolved !== false && window.umami) {
          umami = window.umami;
        }
      })
      .catch((err) => {
      // throwing an error results in a crash during development,
      // could be a real bugger if script is not always available
      // instead, fail almost silently
        console.error('An error occured, could not load Umami', err);
      });
  }

  return {
    provide: {
      umami,
    },
  };
});
