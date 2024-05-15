import type { ModuleOptions } from './internal/types';

declare module '@nuxt/schema' {
  interface AppConfig {
    umami: ModuleOptions;
  }

  interface AppConfigInput {
    umami?: ModuleOptions;
  }

}

export {};
