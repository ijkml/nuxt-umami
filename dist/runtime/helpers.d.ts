import type { Umami } from '../types';
export declare function useMock(): Umami;
/**
 * [Over-]simplified version of VueUse useScriptTag
 * @param src
 * @param attrs
 */
export declare function loadScript(src: string, attrs: Record<string, string>): {
    load: () => Promise<false | HTMLScriptElement>;
};
