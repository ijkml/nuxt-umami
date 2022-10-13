import { ModuleOptions, Umami } from './main'

declare module 'vue/types/vue' {
  interface Vue {
    $umami: Umami
  }
}

declare module '@nuxt/types' {
  // $umami inside fetch, plugins, middleware, etc
  interface NuxtAppOptions {
    $umami: Umami
  }

  // module configuration in nuxt.config.ts
  interface NuxtOptions {
    umami?: ModuleOptions
  }

  interface Context {
    $umami: Umami
  }
}

declare module 'vuex/types/index' {
  // $umami inside Vuex stores
  interface Store<S> {
    readonly $umami: ReturnType<Umami>
  }
}

