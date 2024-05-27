import type { ModuleOptions } from './internal/types';

import { defineAppConfig } from 'nuxt/app';

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
