![cover image](/preview/cover.png)

# Nuxt Umami Module
  
[![npm](https://img.shields.io/npm/v/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![npm](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![npm](https://img.shields.io/npm/l/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)

This is a fully featured nuxt module that makes implementing [**Umami Analytics**](https://umami.is/) into your Nuxt project a breeze.

## Features

- 📖 Open Source
- ✨ SSR support
- 💯 Feature complete
- ✅ TypeScript & JSDocs
- ✅ Supports `<script setup>` syntax


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

### Setup

Add the module to `nuxt.config`:

```typescript
// nuxt.config.ts (Nuxt 3)
export default defineNuxtConfig({
  modules: ['nuxt-umami'],
  umami: {
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

## 🔥 Contributions

<a href="https://github.com/ijkml/nuxt-umami/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ijkml/nuxt-umami" />
</a>

<!-- Banner Image For Reference: https://banner.browserku.com/ -->
<!-- <div
	class="relative bg-gradient-to-r from-[#255461] to-[#00DC82] h-full font-open-sans bg-cover bg-center p-2"
>
	<div class="z-2 relative bg-white bg-opacity-90 rounded-md shadow-lg h-full p-7 flex flex-col justify-between overflow-hidden">
        <img class="absolute z-1 top-[-80px] right-[-20px] w-[500px] opacity-8" :src="bg"/>
        <div>
    	  <h1 class="text-5xl font-bold line-clamp-3 pb-1">{{ title }}</h1>
          <p class="text-gray-700 italic">{{ description }}</p>
        </div>
		<div class="mt-3 flex items-center justify-between">
			<div class="flex items-center space-x-2 text-lg">
				<img class="w-10 h-10 rounded-full" crossorigin="anonymous" :src="avatar" />
				<span class="font-semibold">{{ author }}</span>
			</div>
			<div>
				<img :src="logo" alt="logo" class="h-12" />
			</div>
		</div>
	</div>
</div> -->
<!-- Format Data -->
<!-- {
  "title": "nuxt-umami",
  "description": "Umami Analytics built for Nuxt 2/3.",
  "author": "Moses Laurence",
  "avatar": "https://avatars.githubusercontent.com/u/52390439?v=4",
  "bg": "https://nuxtjs.org/design-kit/black-logo.svg",
  "logo": "https://nuxtjs.org/design-kit/black-text.svg"
} -->
