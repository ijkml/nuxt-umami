# Nuxt Umami (@next)

[![npm](https://img.shields.io/npm/v/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![Downloads](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![License](https://img.shields.io/npm/l/nuxt-umami.svg?style=flat-square)](/LICENSE)

Deeply integrate [**Umami Analytics**](https://umami.is/) into your Nuxt websites / applications.

> **Heads up:**
> This version uses features (Nuxt Layers) that are only available in **Nuxt 3**.

## Features

- 📖 Open Source, of course
- ✨ SSR Support
- ➖ No extra script tag
- ⛔ Escapes ad-blockers and script-blockers
- 💯 Feature complete + extensive config
- ✅ Better Typescript, JSDocs, auto completion
- ✅ Error handling + debugging
- ✅ Vue composables + auto import (use everywhere)

## Setup

### Step 1: Installation

```bash
pnpm add nuxt-umami@next #pnpm
```

```bash
npm install nuxt-umami@next #npm
```

### Step 2: Add to Nuxt

Add `nuxt-umami` to your `extends` array in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: ['nuxt-umami']
});
```

Or, you can totally skip the installation process and do

```ts
defineNuxtConfig({
  extends: ['nuxt-umami@next']
});
```

### Step 3: Configure Umami

You can provide configuration options using the `app.config.ts` file or `appConfig` property of the Nuxt config.

#### `app.config.ts` file

(recommended for readability and ease of update)

```ts
export default defineAppConfig({
  umami: {
  // ...umami config here
  },
});
```

#### `appConfig` property

```ts
defineNuxtConfig({
  extends: ['nuxt-umami@next'],
  appConfig: {
    umami: {
      // ...umami config here
    },
  },
});
```

## Configuration

| option | type | description | required | default |
|---|---|---|---|---|
| host | string | Your Umami endpoint. This is where your script is hosted. Eg: `https://ijkml.xyz/`. | true | '' |
| id | string | Unique website-id provided by Umami. | true | '' |
| domains | string | Limit tracker to specific domains by providing a comma-separated list (without 'http'). Leave blank for all domains. | false | '' |
| ignoreDnt | boolean | Option to ignore browsers' Do Not Track setting. | false | true |
| autoTrack | boolean | Option to automatically track page views. | false | true |
| ignoreLocalhost | boolean | Option to prevent tracking on localhost. | false | false |

## Usage

...coming soon.

[MIT](./LICENSE) License © 2023 [ML](https://github.com/ijkml/)
