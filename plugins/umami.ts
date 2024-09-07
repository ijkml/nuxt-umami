import { directive } from '../internal/directive';
import { umConfig } from '../internal/utils';
import { umTrackView } from '../utils/umami';

let autoTrackEnabled = false;

export default defineNuxtPlugin({
  name: 'umami-tracker',
  async setup(nuxtApp) {
    const { useDirective, autoTrack } = umConfig.value;

    autoTrackEnabled = autoTrack;

    if (useDirective)
      nuxtApp.vueApp.directive('umami', directive);
  },
  hooks: {
    'page:finish': function () {
      if (!autoTrackEnabled)
        return;

      setTimeout(umTrackView, 300);

      // TODO: fix
      // `useHead()` updates the DOM's head using this hook
      // currently, there is no hook we can watch, so we need
      // to wait for the update to finish, to capture title
      // https://github.com/nuxt/nuxt/blob/3dbe7ce3482dac7c7ca06eb5a2eee23a7fcad2ac/packages/nuxt/src/head/runtime/plugins/unhead.ts#L35
    },
    'app:beforeMount': function () {
      console.info(
        `%cNEW VERSION AVAILABLE: Nuxt Umami v3! 🚀\nGet the latest features and improvements.\nCheck the announcement: https://umami.nuxt.dev/v2-upgrade-guide.`,
        'color: #bada55; font-weight: 500;',
      );
    },
  },
});
