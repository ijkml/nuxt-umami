
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['umami']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['umami']?: ModuleOptions }
}


export { default } from './module'
