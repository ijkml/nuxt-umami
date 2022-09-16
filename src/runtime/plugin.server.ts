import { defineNuxtPlugin } from '#app';
import type { Umami } from '../types';

const trackEvent = (eventValue: string, eventType?: string, url?: string, websiteId?: string) => {};
const trackView = (url: string, referer?: string, websiteId?: string) => {};

const umami: Umami = (eventValue: string) => trackEvent(eventValue);
umami.trackView = trackView;
umami.trackEvent = trackEvent;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      umami,
    },
  };
});
