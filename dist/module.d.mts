import * as _nuxt_schema from '@nuxt/schema';

declare const _default: _nuxt_schema.NuxtModule<Partial<{
    enabled: boolean;
    host: string;
    id: string;
    domains: string[] | null;
    autoTrack: boolean;
    ignoreLocalhost: boolean;
    customEndpoint: string | null;
    tag: string | null;
    useDirective: boolean;
    logErrors: boolean;
    proxy: false | "direct" | "cloak";
    trailingSlash: "any" | "always" | "never";
    excludeQueryParams: boolean;
    urlOptions?: Partial<{
        trailingSlash: "any" | "always" | "never";
        excludeSearch: boolean;
        excludeHash: boolean;
    }>;
}>, Partial<{
    enabled: boolean;
    host: string;
    id: string;
    domains: string[] | null;
    autoTrack: boolean;
    ignoreLocalhost: boolean;
    customEndpoint: string | null;
    tag: string | null;
    useDirective: boolean;
    logErrors: boolean;
    proxy: false | "direct" | "cloak";
    trailingSlash: "any" | "always" | "never";
    excludeQueryParams: boolean;
    urlOptions?: Partial<{
        trailingSlash: "any" | "always" | "never";
        excludeSearch: boolean;
        excludeHash: boolean;
    }>;
}>, false>;

export { _default as default };
