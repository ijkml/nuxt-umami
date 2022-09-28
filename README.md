# Nuxt Umami Module

## Features
- SSR support
- TypeScript & JSDocs
- Feature complete
- The `<script setup>` syntax


## Installation
With `pnpm`
```bash
pnpm add nuxt-umami
```
Or, with `npm`
```bash
npm install nuxt-umami
```
Or, with `yarn`
```bash
yarn add nuxt-umami
```

### Configuration
Add the module to `nuxt.config`:
```javascript
{
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
```

Only `websiteId` and `scriptUrl` are mandatory. [See the Umami docs](https://umami.is/docs/tracker-configuration) for more explanation of these options.

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
Hey, I'm [ML](https://github.com/ijkml/), when I'm not trying to break into open source,
I'm busy trying to break into [shit-posting on Twitter](https://twitter.com/ijk_ml) <br>
If you find a bug or have any trouble using the module, please open an issue. I'm available to work on it and help you out.

Using the module in your app? Consider giving it a star 🌟. It'd mean the world to me.
