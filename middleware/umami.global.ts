import { umTrackView } from '../composables/umami';

export default defineNuxtRouteMiddleware((to) => {
  const { umami: { autoTrack } = {} } = useAppConfig();

  if (autoTrack) {
    umTrackView(to.fullPath);
  }
});
