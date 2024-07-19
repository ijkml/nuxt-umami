## Nuxt Umami

Integrate [**Umami Analytics**](https://umami.is/) into your Nuxt websites/applications.

[![npm](https://img.shields.io/npm/v/nuxt-umami?style=flat-square)](https://www.npmjs.com/package/nuxt-umami/)
[![Downloads](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![License](https://img.shields.io/npm/l/nuxt-umami?style=flat-square)](https://github.com/ijkml/nuxt-umami/blob/main/LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-21262d?style=flat-square&logo=github&logoColor=db61a2)](https://github.com/sponsors/ijkml)

## Features

- 📖 Open source
- ✨ SSR support, of course
- ➖ No extra script, no loading delay
- 😜 Escapes ad/script blockers
- 💯 Simple, feature complete
- ✅ Typescript & auto completion
- ✅ Auto imported, available (almsot) everywhere
- ✅ Easy debuggin' (one `console.log` at a time)

## Setup

### 🚀 Try it online

<a href="https://stackblitz.com/edit/nuxt-umami"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz"></a>

### Step 1: Install and add to Nuxt

Install using your favorite package manager...

```bash
pnpm add nuxt-umami
```

Then add `nuxt-umami` to the `extends` array in `nuxt.config`:

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

### Step 2: Configure Umami

You can provide configuration options using the `app.config.ts` file or `appConfig` property of the Nuxt config.

#### `app.config.ts` file

(recommended: easier to read and update)

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

You can provide the `host` and `id` config (only) as environment variables. Simply add `NUXT_PUBLIC_UMAMI_HOST` and `NUXT_PUBLIC_UMAMI_ID` to your `.env` file, and that's it. Please note that provided env variables override `appConfig`.

```sh
NUXT_PUBLIC_UMAMI_HOST="https://domain.tld"
NUXT_PUBLIC_UMAMI_ID="abc123-456def-ghi789"
```

### Step 3: Use it

```vue
<script setup>
function complexCalc() {
  // ... do something
  umTrackEvent('complex-btn', { propA: 1, propB: 'two', propC: false });
}
</script>

<template>
  <button @click="umTrackEvent('button-1')">
    Button 1
  </button>

  <button @click="complexCalc">
    Button 2
  </button>
</template>
```

## Configuration

| option          | type                      | description                                                                                                                    | required | default     |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------- |
| host            | `string`                  | Your Umami endpoint. This is where your script is hosted. Eg: `https://ijkml.dev/`.                                            | yes      | `''`        |
| id              | `string`                  | Unique website-id provided by Umami.                                                                                           | yes      | `''`        |
| domains         | `string \| Array<string>` | Limit tracker to specific domains by providing an array or comma-separated list (without 'http'). Leave blank for all domains. | no       | `undefined` |
| autoTrack       | `boolean`                 | Option to automatically track page views.                                                                                      | no       | `true`      |
| ignoreLocalhost | `boolean`                 | Option to prevent tracking on localhost.                                                                                       | no       | `false`     |
| customEndpoint  | `string`                  | Set a custom `COLLECT_API_ENDPOINT`. See [Docs](https://umami.is/docs/environment-variables).                                  | no       | `undefined` |
| version         | `1 \| 2`                  | Umami version                                                                                                                  | no       | `1`         |
| useDirective    | `boolean`                 | Option to enable the `v-umami` directive. [See below](#vue-directive).                                                         | no       | `false`     |
| debug           | `boolean`                 | Option to enable error logs (in production), useful for testing in prod :)                                                     | no       | `false`     |

## Usage

Two functions are auto-imported, `umTrackView()` and `umTrackEvent()`. Use them freely. Please note that in `<script setup>`, these functions might fail silently. Use the `onMounted` hook or call them on user interaction.

The `v-umami` directive can be enabled [in the config](#vue-directive).

### Available Methods

- `umTrackView(url, referrer)`
  - `url`: the path being tracked, eg `/about`, `/contact?by=phone#office`. This can be correctly inferred. Equivalent of `router.fullPath`.
  - `referrer`: the page referrer. This can be correctly inferred. Equivalent of `document.referrer` or the `ref` search param in the url (eg: `example.com/?ref=thereferrer`).

- `umTrackEvent(eventName, eventData)`
  - `eventName`: a string type text
  - `eventData`: an object in the format `{key: value}`, where `key` is a string and `value` is a string, number, or boolean.

Reference: [Umami Tracker Functions](https://umami.is/docs/tracker-functions).

### Method Return

Both `umTrackEvent` and `umTrackView` return a Promise with an `ok` status that you can await or chain, `Promise<{ok: boolean}>`.

```ts
umTrackView().then(res => console.log(res.ok));

umTrackView().then(({ ok }) => console.log(ok));
```

### Vue Directive

To use directive `v-umami`, add `useDirective: true` to your config.

You can pass a string as the event name, or an object containing a `name` property (required, this is the event name). Every other property will be passed on as event data.

```vue
<button v-umami="'Event-Name'">
  Event Button
</button>

<button v-umami="{name: 'Event-Name'}">
  as object
</button>

<button v-umami="{name: 'Event-Name', position: 'left', ...others}">
  with event details
</button>
```

### Prevent tracking yourself

To prevent tracking yourself, add the key `umami.disabled` to your browser's localStorage. Set the value to 1.

See: [Umami Docs](https://umami.is/docs/track-events#prevent-tracking-yourself).

## FAQS and Quirks

* __I don't see errors in live sites...__
  * If you're debugging live sites, set `debug: true` in your config.
* __Can I use Umami v2/Cloud?__
  * Yes. To use Umami v2, set `version: 2` in the Nuxt-Umami config.
* __`nuxt typecheck` fails! What can I do to resolve it?__
  * The problem could be tied to `pnpm`'s dependency hoisting. Thanks to [Jeet for discovering this](https://github.com/ijkml/nuxt-umami/issues/85#issuecomment-1868442446). Simply create a `.npmrc` file in the root of your Nuxt project and add `shamefully-hoist=true`. If that doesn't work, I'll be happy to look into it further.
* __Welp, I am getting some CORS errors!__
  * Some adblockers like _uBlock_ and _Ghostery_ block Umami Cloud's endpoints. Try to disable your adblockers (yes, all of them). Also, double-check your config and Umami version. If all else fails, host your own Umami instance.
* __`autoTrack` is not working?__
  * The current implementation of `autoTrack` relies on `<NuxtPage>` being present in your app. If you don't have `<NuxtPage>`, you'd have to call `umTrackView()` yourself `onMounted()`. [See this issue](https://github.com/ijkml/nuxt-umami/issues/102#issuecomment-2112482840).
* __How do I set up my own Umami instance?__
  * Miracle Onyenma published a simple guide in his blog. [Check it out](https://miracleio.me/blog/set-up-analytics-for-your-nuxt-3-app-with-umami).
* __Should I sponsor this project?__
  * Absolutely, [you can do that here](https://github.com/sponsors/ijkml).

## Issues, Bugs, Ideas?

Contributions are welcome, start a discussion, send a PR! If you find an issue, keep it, finders keepers 😅. (Or, open an issue, I'll be happy to help.)

## Contributors

Thank you!

<a href="https://github.com/ijkml/nuxt-umami/graphs/contributors">
  <img alt="Nuxt Umami contributors" src="https://contrib.rocks/image?repo=ijkml/nuxt-umami" />
</a>

<hr />

MIT License ©2024 [ML](https://github.com/ijkml/)
