# Nuxt Umami

[![npm](https://img.shields.io/npm/v/nuxt-umami?style=flat-square)](https://www.npmjs.com/package/nuxt-umami/)
[![Downloads](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![License](https://img.shields.io/npm/l/nuxt-umami?style=flat-square)](/LICENSE)

Integrate [**Umami Analytics**](https://umami.is/) into your Nuxt websites / applications.

> **Heads up:**
> This version uses features (Nuxt Layers) that are only available in **Nuxt 3**.
> Check out [Nuxt Umami v1](https://github.com/ijkml/nuxt-umami/tree/v1) for Nuxt 2 compat.

## Features

- 📖 Open Source
- ✨ SSR Support, of course
- ➖ No extra script: no extra tag, no script loading, instant availability
- 😜 Escapes ad & script blockers (catch me if you can)
- 💯 Simplified usage, feature complete, extensive config
- ✅ Typescript, JSDocs, auto completion
- ✅ Error handling + debugging
- ✅ Nuxt utils + auto import

## Setup

### 🚀 Try it online

<a href="https://stackblitz.com/edit/nuxt-umami-next"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz"></a>

### Step 1: Install and add to Nuxt

Install using your favorite package manager...

```bash
pnpm add nuxt-umami #pnpm
```

```bash
npm install nuxt-umami #npm
```

Then add `nuxt-umami` to your `extends` array in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: ['nuxt-umami']
});
```

Or, you can totally skip the installation process and do

```ts
defineNuxtConfig({
  extends: ['github:ijkml/nuxt-umami']
});
```

> **Warning**:
> This might cause unwanted errors due to changes as the branch is still WIP.

### Step 2: Configure Umami

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
  extends: ['nuxt-umami'],
  appConfig: {
    umami: {
      // ...umami config here
    },
  },
});
```

#### Environment Variables

> **Note**:
> Available in `^2.1.0` and takes precedence over `appConfig`.

You can provide the `host` and `id` config (only) as environment variables. Simply add `NUXT_PUBLIC_UMAMI_HOST` and `NUXT_PUBLIC_UMAMI_ID` to your `.env` file, and that's it.

```sh
NUXT_PUBLIC_UMAMI_HOST="https://domain.tld"
NUXT_PUBLIC_UMAMI_ID="abc123-456def-ghi789"
```

### Step 3:

Use it.

## Configuration

| option | type | description | required | default |
|---|---|---|---|---|
| host | `string` | Your Umami endpoint. This is where your script is hosted. Eg: `https://ijkml.xyz/`. | yes | `''` |
| id | `string` | Unique website-id provided by Umami. | yes | `''` |
| domains | `string \| Array<string>`  | Limit tracker to specific domains by providing an array or comma-separated list (without 'http'). Leave blank for all domains. | no | `undefined` |
| ignoreDnt | `boolean` | Option to ignore browsers' Do Not Track setting. | no | `true` |
| autoTrack | `boolean` | Option to automatically track page views. | no | `true` |
| ignoreLocalhost | `boolean` | Option to prevent tracking on localhost. | no | `false` |
| customEndpoint | `string` | Set a custom `COLLECT_API_ENDPOINT`. See [Docs](https://umami.is/docs/environment-variables). | no | `undefined`
| version | `1 \| 2`  | Umami version | no | `1` |

## Usage

Two functions are auto-imported, `umTrackView()` and `umTrackEvent()`. Use them however and wherever you like.

### Available Methods

- `umTrackView(url, referrer)`
  - `url`: the path being tracked, eg `/about`, `/contact?by=phone#office`. This can be correctly inferred. Equivalent of `router.fullPath`.
  - `referrer`: the page referrer. This can be correctly inferred. Equivalent of `document.referrer`.

- `umTrackEvent(eventName, eventData)`
  - `eventName`: a string type text
  - `eventData`: an object in the format `{key: value}`, where `key` is a string and `value` is a string, number, or boolean.


Reference: [Umami Tracker Functions](https://umami.is/docs/tracker-functions).


## Umami v2

> **Note**:
> Support for Umami v2 is now available in `^2.3.0`.

To use Umami v2, set `version: 2` in the Umami config.

## Issues, Bugs, Ideas?

Open an issue. Contributions are welcome, just send a PR! If you encounter any issues, don't hesitate to open an issue. I'm always available to help and resolve any bugs.

## Contributors

<a href="https://github.com/ijkml/nuxt-umami/graphs/contributors">
  <img alt="Nuxt Umami contributors" src="https://contrib.rocks/image?repo=ijkml/nuxt-umami" />
</a>

<br />
<hr />

[MIT](./LICENSE) License © 2023 [ML](https://github.com/ijkml/)
