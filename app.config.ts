import type { ModuleOptions } from './internal/types';

export default defineAppConfig({
});

declare module '@nuxt/schema' {
  interface AppConfig {
    umami: ModuleOptions;
  }

  interface AppConfigInput {
    umami?: ModuleOptions;
  }

}
