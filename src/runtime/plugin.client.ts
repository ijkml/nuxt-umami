import { defineNuxtPlugin } from '#app';
import type { ModuleOptions } from '../types';

/**
 * [Over-]simplified version of VueUse useScriptTag
 * @param src
 * @param attrs
 */
function loadScript(
  src: string,
  attrs: Record<string, string>,
) {
  const document = (typeof window !== 'undefined') ? window.document : undefined;
  const _attrs = attrs || {};
  let _promise: Promise<HTMLScriptElement | boolean> | null = null;

  /**
   * Load the script specified via `src`.
   *
   * @returns Promise<HTMLScriptElement>
   */
  const loadScript = (): Promise<HTMLScriptElement | boolean> => new Promise((resolve, reject) => {
    // Some little closure for resolving the Promise.
    const resolveWithElement = (el: HTMLScriptElement) => {
      resolve(el);
      return el;
    };

    // Check if document actually exists, otherwise resolve the Promise (SSR Support).
    if (!document) {
      resolve(false);
      return;
    }

    // Local variable defining if the <script> tag should be appended or not.
    let shouldAppend = false;

    let el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    // Script tag not found, preparing the element for appending
    if (!el) {
      el = document.createElement('script');
      el.type = 'text/javascript';
      el.async = true;
      el.defer = true;
      el.src = src;

      Object.entries(_attrs).forEach(([name, value]) => el?.setAttribute(name, value));

      // Enables shouldAppend
      shouldAppend = true;
    } else if (el.hasAttribute('data-loaded')) {
      // Script tag already exists, resolve the loading Promise with it.
      resolveWithElement(el);
    }

    // Event listeners
    el.addEventListener('error', event => reject(event));
    el.addEventListener('abort', event => reject(event));
    el.addEventListener('load', () => {
      el!.setAttribute('data-loaded', 'true');

      resolveWithElement(el!);
    });

    // Append the <script> tag to head.
    if (shouldAppend) {
      el = document.head.appendChild(el);
    }
  });

  /**
   * Exposed singleton wrapper for `loadScript`, avoiding calling it twice.
   *
   * @returns Promise<HTMLScriptElement>
   */
  const load = (): Promise<HTMLScriptElement | boolean> => {
    if (!_promise) {
      _promise = loadScript();
    }

    return _promise;
  };

  return { load };
}

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

  const { load } = loadScript(scriptUrl, attrs);

  await load().catch((err) => {
    throw new Error('An error occured, could not load Umami', { cause: err });
  });

  const umami = window.umami;

  return {
    provide: {
      umami,
    },
  };
});
