import type { PreflightResult } from './types';

type FunctionErrs = 'collect' | 'directive' | 'event-name';
type PreflightErrs = Exclude<PreflightResult, 'ssr' | true>;
type ErrorType = PreflightErrs | FunctionErrs;

type LogLevel = 'info' | 'warn' | 'error';
type ErrorId = `err-${ErrorType}`;
interface ErrorObj {
  level: LogLevel;
  text: string;
}

const warnings: Record<ErrorId, ErrorObj> = {
  'err-domain': { level: 'info', text: 'Tracking is disabled for this domain because it is not in the allowed domain config.' },
  'err-id': { level: 'error', text: '`id` is missing or incorrectly configured. Check Umami config.' },
  'err-host': { level: 'error', text: '`host` is missing or incorrectly configured. Check Umami config.' },
  'err-local': { level: 'info', text: 'Tracking disabled on localhost' },
  'err-collect': { level: 'error', text: 'Uhm... Something went wrong and I have no clue.' },
  'err-directive': { level: 'error', text: 'Invalid v-umami directive value. Expected string or object with {key:value} pairs. See https://github.com/ijkml/nuxt-umami#available-methods' },
  'err-event-name': { level: 'warn', text: 'An Umami track event was fired without a name. `#unknown-event` will be used as event name.' },
};

function debug(id: ErrorId, raw?: any) {
  const { level, text } = warnings[id];
  // eslint-disable-next-line no-console
  console[level](`[UMAMI]: ${text}`, '\n');
  // eslint-disable-next-line no-console
  raw && (console[level](raw));
}

export { debug };
