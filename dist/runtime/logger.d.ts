import type { PreflightResult } from '../types.js';
type PreflightErrId = Exclude<PreflightResult, 'ssr' | true> | 'collect' | 'directive' | 'event-name' | 'endpoint' | 'id' | 'enabled' | 'currency' | 'revenue';
declare function logger(id: PreflightErrId, raw?: unknown): void;
declare function fauxLogger(..._args: Parameters<typeof logger>): void;
export { fauxLogger, logger };
