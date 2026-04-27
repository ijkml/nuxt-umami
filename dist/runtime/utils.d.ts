import type { ModuleOptions } from '../options.js';
import type { FetchResult, NormalizedModuleOptions, ServerPayload } from '../types.js';
declare function earlyPromise(ok: boolean): FetchResult;
declare function isValidString(value: unknown): value is string;
declare function normalizeConfig(options?: ModuleOptions): NormalizedModuleOptions;
declare function flattenObject(obj?: Record<string, unknown> | null, prefix?: string): Record<string, unknown> | undefined;
type ValidatePayloadReturn = {
    success: true;
    output: ServerPayload;
} | {
    success: false;
    output: unknown;
};
declare function parseEventBody(body: unknown): ValidatePayloadReturn;
export { earlyPromise, flattenObject, isValidString, normalizeConfig, parseEventBody, };
