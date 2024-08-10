import { umTrackView } from './composables';
import { directive } from './directive';
import { defineNuxtPlugin } from '#app';
import { config } from '#build/umami.config.mjs';

const { useDirective, autoTrack } = config;

export default defineNuxtPlugin({
  name: 'umami-tracker',
  parallel: true,
  async setup(nuxtApp) {
    if (useDirective)
      nuxtApp.vueApp.directive('umami', directive);
    if (autoTrack) {
      nuxtApp.hook('page:finish', () => {
        setTimeout(umTrackView, 250);

        // TODO: fix
        // `useHead()` updates the DOM's head using this hook
        // currently, there is no hook we can watch, so we need
        // to wait for the update to finish, to capture title

        // TODO: update
        // `page:loading:end` hook sounds like the fix for this,
        // but the hook currently runs twice [bug: #26535]

        // TODO: also
        // injectHead().hooks.hook('dom:rendered', () => {})
        // works flawlessly as long as the page is having its head
        // rendered, if only there was a way to ALWAYS call that hook ;)
      });
    }
  },
});
