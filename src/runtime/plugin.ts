import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { startPerformanceTracking, umTrackView } from './composables';
import { directive } from './directive';

export default defineNuxtPlugin({
  name: 'umami-tracker',
  parallel: true,
  async setup(nuxtApp) {
    const { useDirective, autoTrack, performance } = useRuntimeConfig().public.umami;

    if (useDirective)
      nuxtApp.vueApp.directive('umami', directive);

    if (performance)
      startPerformanceTracking();

    if (autoTrack) {
      // `page:loading:end` fires once per navigation after async data and
      // `useHead()` have settled, so the document title is correct and we
      // don't need to dedupe nested-<NuxtPage> double-fires. Requires the
      // fix from Nuxt PR #29009 (shipped in v3.15.2 / v4.0.0); our peer
      // dep `>=3.15.4` guarantees it.
      nuxtApp.hook('page:loading:end', () => {
        umTrackView();
      });
    }
  },
});
