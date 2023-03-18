export default defineAppConfig({
  umami: {
    id: '',
    host: '',
    domains: undefined,
    autoTrack: true,
    ignoreDnt: true,
    ignoreLocalhost: false,
    version: 1,
  },
});

declare module '@nuxt/schema' {
  interface AppConfigInput {
    umami: {
      /**
       * Your umami endpoint. This is where you would
       * normally load the script from.
       * @required true
       * @example 'https://ijkml.xyz/'
       */
      host: string
      /**
       * Unique identifier provided by Umami
       *
       * @required true
       * @example `3c255b6d-678a-42dd-8074-272ee5b78484`
       */
      id: string
      /**
       * Configure the tracker to only run on specific domains.
       * Provide a comma delimited list of domains (without 'http').
       * Leave as `undefined` to run on all domains.
       *
       * @example `mywebsite.com, mywebsite2.com`
       * @default undefined
       */
      domains?: string
      /**
       * Whether to ignore browsers' Do Not Track setting.
       *
       * Setting this to `false` will totally disable tracking
       * on browsers that have the DoNotTrack setting turned on.
       * @default true
       */
      ignoreDnt?: boolean
      /**
       * Option to automatically track page views.
       *
       * @default true
       */
      autoTrack?: boolean
      /**
       * Whether or not to track during development (localhost).
       *
       * @default false
       */
      ignoreLocalhost?: boolean
      /**
       * Version of Umami used, either `1.x.x` or `2.x.x`
       *
       * @default 1
       */
      version?: 1 | 2
    }
  }

  interface AppConfig {
    umami: {
      host: string
      id: string
      autoTrack?: boolean
      domains?: string
      ignoreDnt?: boolean
      ignoreLocalhost?: boolean
      version?: 1 | 2
    }
  }
}
