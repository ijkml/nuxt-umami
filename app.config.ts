export default defineAppConfig({
  umami: {
    id: 'ba4c9424-c4b7-48df-b66d-4213730673e5',
    host: 'https://ml-umami.netlify.app/umami.js',
    domains: undefined,
    autoTrack: false,
    ignoreDnt: true,
    ignoreLocalhost: false,
  },
});

declare module '@nuxt/schema' {
  interface AppConfigInput {
    umami: {
      /**
       * Your umami endpoint. This is where you would
       * normally load the script from.
       *
       * For example...
       *
       * script url: `http://ijkml.xyz/umami.js`
       *
       * endpoint: `http://ijkml.xyz/`
       */
      host: string
      /**
       * Unique identifier provided by Umami
       *
       * Example `3c255b6d-678a-42dd-8074-272ee5b78484`
       */
      id: string
      /**
       * Configure the tracker to only run on specific domains.
       * Provide a comma delimited list of domains (without 'http').
       * Leave as `undefined` to run on all domains.
       *
       * Example: `mywebsite.com, mywebsite2.com`
       * @default undefined
       */
      domains?: string
      /**
       * Whether to ignore users' Do Not Track setting.
       *
       * Setting this to `false` will totally disable tracking
       * on browsers that have the DoNotTrack setting turned on.
       * @default true
       */
      ignoreDnt?: boolean
      /**
       * Whether or not to automatically track page views.
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
    }
  }
}
