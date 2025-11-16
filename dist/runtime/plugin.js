import { defineNuxtPlugin } from "#app";
import { config } from "#build/umami.config.mjs";
import { umTrackView } from "./composables.js";
import { directive } from "./directive.js";
const { useDirective, autoTrack } = config;
export default defineNuxtPlugin({
  name: "umami-tracker",
  parallel: true,
  async setup(nuxtApp) {
    if (useDirective)
      nuxtApp.vueApp.directive("umami", directive);
    if (autoTrack) {
      nuxtApp.hook("page:finish", () => {
        setTimeout(umTrackView, 250);
      });
    }
  }
});
