import { getConfig } from '../internal/utils';
import { umTrackView } from '../utils/umami';

export default defineNuxtRouteMiddleware((to) => {
  const { autoTrack } = getConfig();

  if (autoTrack) {
    umTrackView(to.fullPath);
  }
});
