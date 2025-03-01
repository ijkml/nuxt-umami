import type { PreflightResult } from '../types';

type PreflightErrId = Exclude<PreflightResult, 'ssr' | true>
  | 'collect' | 'directive' | 'event-name' | 'endpoint' | 'id'
  | 'enabled' | 'currency' | 'revenue';
type LogLevel = 'info' | 'warn' | 'error';
interface ErrorObj {
  level: LogLevel;
  text: string;
}

const warnings: Record<PreflightErrId, ErrorObj> = {
  'enabled': { level: 'info', text: '`nuxt-umami` is disabled.' },
  'id': { level: 'error', text: '`id` is missing or incorrectly configured. Check module config.' },
  'endpoint': { level: 'error', text: 'Your API endpoint is missing or incorrectly configured. Check `host` & `customEndpoint` in module config.' },
  'domain': { level: 'info', text: 'Tracking is disabled for this domain because it is not in the allowed domain config.' },
  'localhost': { level: 'info', text: 'Tracking disabled on localhost' },
  'local-storage': { level: 'info', text: 'Tracking disabled via local-storage' },
  'collect': { level: 'error', text: 'Uhm... Something went wrong and I have no clue.' },
  'directive': { level: 'error', text: 'Invalid v-umami directive value. Expected string or object with {key:value} pairs. See https://umami.nuxt.dev/api/usage#directive' },
  'event-name': { level: 'warn', text: 'An Umami track event was fired without a name. `#unknown-event` will be used as event name.' },
  'currency': { level: 'warn', text: 'Invalid currency passed. Expected ISO 4217 format. See https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes' },
  'revenue': { level: 'error', text: 'Revenue is not a number. Expected number, got: ' },
};

function logger(id: PreflightErrId, raw?: unknown) {
  const { level, text } = warnings[id];
  console[level](`[UMAMI]: ${text}`, '\n');

  if (raw)
    console[level](raw);
}

function fauxLogger(..._args: Parameters<typeof logger>) {}

export { fauxLogger, logger };
