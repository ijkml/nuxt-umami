import type { ModuleOptions, Umami } from '../types/main';

function warnMock() {
  if (process.client && process.env.NODE_ENV !== 'production') {
    console.warn('Umami is not ready. Maybe there was an error loading the script or you are using it before `onMounted`.');
  }
}

export function useMock() {
  const trackEvent = (eventValue: string, eventType?: string, url?: string, websiteId?: string) => warnMock();
  const trackView = (url: string, referer?: string, websiteId?: string) => warnMock();

  // mock the structure and style of Umami
  const umami: Umami = (eventValue: string) => trackEvent(eventValue);
  umami.trackView = trackView;
  umami.trackEvent = trackEvent;

  return umami;
}

/**
 * [Over-]simplified version of VueUse useScriptTag
 * @param src
 * @param attrs
 */
export function loadScript(
  src: string,
  attrs: Record<string, string | boolean>,
) {
  type LoadScriptPromiseType = Promise<HTMLScriptElement | false>;

  const document = (typeof window !== 'undefined') ? window.document : undefined;
  const _attrs = attrs || {};
  let _promise: null | LoadScriptPromiseType = null;

  /**
   * Load the script specified via `src`.
   *
   * @returns Promise<HTMLScriptElement>
   */
  const loadScript = (): LoadScriptPromiseType => new Promise((resolve, reject) => {
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

      Object.entries(_attrs).forEach(([name, value]) => el.setAttribute(name, value.toString()));

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
  const load = (): LoadScriptPromiseType => {
    if (!_promise) {
      _promise = loadScript();
    }

    return _promise;
  };

  return { load };
}

type ScriptAttributes = Omit<ModuleOptions, 'scriptUrl' | 'enable'>;

/**
 * strip undefined attrs
 * @param attrs
 */
export function stripAttrs({ websiteId, autoTrack, cache, doNotTrack, domains, hostUrl }: ScriptAttributes) {
  return {
    'data-website-id': websiteId,
    // strip unneeded/undefined attrs
    ...autoTrack !== undefined && { 'data-auto-track': autoTrack },
    ...doNotTrack !== undefined && { 'data-do-not-track': doNotTrack },
    ...cache !== undefined && { 'data-cache': cache },
    ...domains !== undefined && { 'data-domains': domains },
    ...hostUrl !== undefined && { 'data-host-url': hostUrl },
  };
}
