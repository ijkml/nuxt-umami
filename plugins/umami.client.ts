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
      // `useHead()` updates the DOM's head using this hook
      // currently, there is no hook we can watch, so we need
      // to wait for the update to finish, to capture title
    },
    'app:mounted': function () {
      // TODO: Introduce a new setting for auto event tracking
      const { autoTrack } = umConfig.value;
      if (!autoTrack || !document) {
        return;
      }
      
      // TODO: We should introduce a new setting to allow users to change the 'umami' keyword, this may help bypass adblockers in the future
      const trackers = document.querySelectorAll('[data-umami-event]');

      trackers.forEach((tracker) => {

        const event = tracker.getAttribute('data-umami-event');

        if (!event) {
          return;
        }

        // TODO: Think about handling multiple events (e.g. click, focus, etc.) (Maybe using an attribute like data-umami-event="click focus") 
        tracker.addEventListener('click', () => {

          const eventData = tracker.getAttributeNames().reduce((acc, name) => {
            if (name.startsWith('data-umami-event-')) {
              const key = name.replace('data-umami-event-', '');
              const value = tracker.getAttribute(name);

              if (!value) {
                return acc;
              }

              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, string>);

          umTrackEvent(event, eventData);
        });
      })
    }
  },
});
