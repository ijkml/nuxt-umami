import type { PreflightResult } from './types';

type LogLevel = 'info' | 'warn' | 'error';
type ErrorId = `err-${PreflightErr}`;
type PreflightErr = Exclude<PreflightResult, 'ssr' | true>;

interface ErrorObj {
  level: LogLevel
  text: string
}

const warnings: Record<ErrorId, ErrorObj> = {
  'err-dnt': { level: 'info', text: 'Tracking disabled by browser.' },
  'err-domain': { level: 'info', text: 'Tracking disabled by domains.' },
  'err-id': { level: 'error', text: '`websiteId` is missing or incorrectly configured.' },
};

function helloDebugger(id: ErrorId) {
  const { level, text } = warnings[id];
  // eslint-disable-next-line no-console
  console[level](`[UMAMI]: ${text}`);
}

export { helloDebugger };
