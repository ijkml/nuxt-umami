import type { PreflightResult } from './types';

type LogLevel = 'info' | 'warn' | 'error';
type ErrorId = `err-${PreflightErr}`;
type PreflightErr = Exclude<PreflightResult, 'ssr' | true> | 'collect' | 'directive';

interface ErrorObj {
  level: LogLevel
  text: string
}

const warnings: Record<ErrorId, ErrorObj> = {
  'err-dnt': { level: 'info', text: "Tracking disabled by browser's DoNotTrack" },
  'err-domain': { level: 'info', text: 'Tracking is disabled for this domain because it is not in the allowed domain config.' },
  'err-id': { level: 'error', text: '`id` is missing or incorrectly configured. Check `runtimeConfig`.' },
  'err-host': { level: 'error', text: '`host` is missing or incorrectly configured. Check `runtimeConfig`.' },
  'err-local': { level: 'info', text: 'Tracking disabled on localhost' },
  'err-collect': { level: 'error', text: 'Uh... Something went wrong and I have no clue.' },
  'err-directive': { level: 'error', text: 'Error: Invalid v-umami directive value. Expected string or object with value:key pairs. See https://github.com/ijkml/nuxt-umami#available-methods' },
};

const helloDebugger = process.env.NODE_ENV === 'production'
  // eslint-disable-next-line unused-imports/no-unused-vars
  ? (id: ErrorId, raw?: any) => {}
  : (id: ErrorId, raw?: any) => {
      const { level, text } = warnings[id];
      // eslint-disable-next-line no-console
      console[level](`[UMAMI]: ${text}`, '\n');
      // eslint-disable-next-line no-console
      raw && (console[level](raw));
    };

export { helloDebugger };
