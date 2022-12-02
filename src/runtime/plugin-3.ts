import { defineNuxtPlugin } from '#app';
import type { ModuleOptions, Umami } from '../types/main';
import { loadScript, stripAttrs, useMock } from './helpers';

export default defineNuxtPlugin(async (nuxtApp) => {
  const options: ModuleOptions = { ...nuxtApp.payload.config.public.umami };

  const { scriptUrl, enable, ...attrOpts } = options;

  const attrs = stripAttrs(attrOpts);

  const mockUmami = useMock();
  let umami: Umami = mockUmami;

  if (enable && process.client) {
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
