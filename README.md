# Nuxt Umami Module
  
[![npm](https://img.shields.io/npm/v/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![Downloads](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![License](https://img.shields.io/npm/l/nuxt-umami.svg?style=flat-square)](/LICENSE)

This is a fully-featured nuxt module that makes implementing [**Umami Analytics**](https://umami.is/) into your Nuxt project a breeze.

---
> **Note:**
>
> Hey! If you're using **Nuxt 3**, I recommend upgrading to [Nuxt Umami v2](https://github.com/ijkml/nuxt-umami/) for better types and DX. **Heads up:** starting **May 7, 2023**, the package will only be available as `nuxt-umami@v1`.
---

<br />

## Features

- 📖 Open Source
- ✨ SSR support
- 💯 Feature complete
- ✅ TypeScript & JSDocs
- ✅ Supports `<script setup>` syntax

---
> **Heads up:**
> [Nuxt Umami v2](https://github.com/ijkml/nuxt-umami/tree/next) has a superior feature set. If you are currently using Nuxt 3, please upgrade to [Nuxt Umami v2](https://github.com/ijkml/nuxt-umami/tree/next).
---

## Installation

With `pnpm`
```bash
pnpm add -D nuxt-umami@v1
```

Or, with `npm`
```bash
npm install -D nuxt-umami@v1
```

Or, with `yarn`
```bash
yarn add -D nuxt-umami@v1
```

### Setup

Add the module to `nuxt.config`:

```typescript
// nuxt.config.ts (Nuxt 3)
export default defineNuxtConfig({
  modules: ['nuxt-umami'],
  umami: {
    enable: true, // enable the module? true by default
    autoTrack: true,
    doNotTrack: false,
    cache: false,
    domains: 'mywebsite.com,mywebsite2.com',
    websiteId: 'your-website-id',
    scriptUrl: 'https://path.to.umami.js',
  }
})

// or inline config
export default defineNuxtConfig({
  modules: [['nuxt-umami', {
    // nuxt-umami options
  }]]
})
```

```javascript
// nuxt.config.js (Nuxt 2)
export default {
  modules: [
    ['nuxt-umami'],
  ],
  umami: {
    autoTrack: true,
    doNotTrack: false,
    cache: false,
    domains: 'mywebsite.com,mywebsite2.com',
    websiteId: 'your-website-id',
    scriptUrl: 'https://path.to.umami.js',
  }
}

// or inline config
export default {
  modules: [
    ['nuxt-umami', {
      // nuxt-umami options
    }]
  ]
}
```

Only `websiteId` and `scriptUrl` are mandatory. [See the Umami docs](https://umami.is/docs/tracker-configuration) for more explanation of these options.

> **New**:
> Set the `enable` option to `false` to disable the module (temporarily).


#### Type not working?

It's a bit of a hack, but adding 
```ts
import {} from 'nuxt-umami';
```
to the top of your config might fix that.

### Environment Variables

If you want, you can set up and use environment variables in `.env` files. But that is not really necessary as the module config does not require any "sensitive" data. Every part of the configuration can be viewed in the script in `<head>` after the page is loaded.

<br>

## Usage

> **Note**:
> You can use `$umami` anywhere you have access to `NuxtApp` or the `useNuxtApp` composable (middleware, asyncData, etc).

> **Warning**:
> $umami is only available `onMounted`.

### In `<script setup>`

```vue
<script setup>
const { $umami } = useNuxtApp();

onMounted(() => {
  // Sends an event with an event type of custom.
  $umami("Signup button click");
});
</script>
```

### In middleware, asyncData, etc

```javascript
const { data } = await useAsyncData("mountains", (nuxtApp) => {
  const { $umami } = nuxtApp();
  // do something, return something
});
```

## Available Functions

> For a list of all available functions, see [Umami Tracker Functions](https://umami.is/docs/tracker-functions)

## Credits

- [VueUse](https://github.com/vueuse/vueuse) - for `useScriptTag` composable.
- [Joe Pritchard](https://github.com/joe-pritchard/nuxt-umami-module) - author of nuxt-umami-module (compatible only with Nuxt 2).

## Author

Hi, I'm [ML](https://github.com/ijkml/). I'm dedicated to contributing to open source and sharing my insights on [Twitter](https://twitter.com/ijk_ml). If you encounter any issues with my module, don't hesitate to open an issue. I'm always available to help and resolve any bugs.

Using the module in your app? Consider giving it a star 🌟. It'd mean the world to me.

## Contributions

<a href="https://github.com/ijkml/nuxt-umami/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ijkml/nuxt-umami" />
</a>

<br />
<hr />

[MIT](./LICENSE) License © 2023 [ML](https://github.com/ijkml/)
