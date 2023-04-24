import { umConfig } from '../internal/utils';
import { umTrackView } from '../utils/umami';

export default defineNuxtPlugin({
  name: 'umami-auto-track',
  hooks: {
    'page:finish': function () {
      const { autoTrack } = umConfig.value;
      if (!autoTrack) {
        return;
      }
      setTimeout(umTrackView, 300);

      // TODO: fix
      // in cases where the title is set/updated in `<script>`,
      // document.title will reflect the old title when we trackView immediately,
      // so we wait [magic seconds] until `document.title` has updated
    },
  },
});
