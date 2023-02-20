export default defineAppConfig({
  umami: {
    endpoint: '',
    websiteId: '',
    ignoreDnt: true,
    domains: undefined,
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
       * script url: `http://ijkml.xyz/umami.js` <br />
       *
       * endpoint: `http://ijkml.xyz/`
       */
      endpoint: string
      /**
       * Unique identifier provided by Umami
       *
       * Example `3c255b6d-678a-42dd-8074-272ee5b78484`
       */
      websiteId: string
      /**
       * Whether to ignore users' Do Not Track setting.
       *
       * Setting this to `false` will totally disable tracking
       * on browsers that have the DoNotTrack setting turned on.
       * @default true
       */
      ignoreDnt?: boolean
      /**
       * Configure the tracker to only run on specific domains.
       * Provide a comma delimited list of domains (without 'http').
       * Leave as `undefined` to run on all domains
       *
       * Example: `mywebsite.com, mywebsite2.com`
       * @default undefined
       */
      domains?: string
    }
  }

  interface AppConfig {
    umami: {
      endpoint: string
      websiteId: string
      ignoreDnt?: boolean
      domains?: string
    }
  }
}
