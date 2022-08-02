# Nuxt Umami Module
<br>

## Features

- SSR support
- TypeScript & JSDocs
- Feature complete
- The `<script setup>` syntax

<br>

## Installation
<br>

With pnpm

```bash
  pnpm add nuxt-umami
```

Or, with npm

```bash
  npm install nuxt-umami
```

Or, with yarn

```bash 
  yarn add nuxt-umami
```
<br>

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

Only `websiteId` and `scriptUrl` are mandatory. See the [Umami docs](https://umami.is/docs/tracker-config) for more explanation of these options.

<br>

## Usage

>  You can use `$umami` anywhere you have access to `NuxtApp` or the `useNuxtApp` composable (middleware, asyncData, etc).

> Note: $umami is only available `onMounted`.

<br>

### In `<script setup>`

```vue
<script setup>
const { $umami } = useNuxtApp();

onMounted(() => {
  // Sends an event with an event type of custom.
  $umami('Signup button click')
});
</script>
```

### In middleware, asyncData, etc

```javascript
const { data } = await useAsyncData(
  'mountains',
  (nuxtApp) => {
    const { $umami } = useNuxtApp();
    // do something, return something
  },
);
```

<br>

## Credits

- [VueUse](https://github.com/vueuse/vueuse) - for `useScriptTag` composable.
- [Joe Pritchard](https://github.com/joe-pritchard/nuxt-umami-module) - author of the nuxt-umami-module for Nuxt 2.
