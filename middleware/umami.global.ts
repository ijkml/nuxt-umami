import { umConfig } from '../internal/utils';
import { umTrackView } from '../utils/umami';

export default defineNuxtRouteMiddleware((to) => {
  const { autoTrack } = umConfig.value;

  if (autoTrack) {
    umTrackView(to.fullPath);
  }
});
