# Nuxt Umami

[![npm](https://img.shields.io/npm/v/nuxt-umami?style=flat-square)](https://www.npmjs.com/package/nuxt-umami/)
[![Downloads](https://img.shields.io/npm/dt/nuxt-umami.svg?style=flat-square)](https://www.npmjs.com/package/nuxt-umami)
[![License](https://img.shields.io/npm/l/nuxt-umami?style=flat-square)](https://github.com/ijkml/nuxt-umami/blob/main/LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-21262d?style=flat-square&logo=github&logoColor=db61a2)](https://github.com/sponsors/ijkml)

Integrate [**Umami Analytics**](https://umami.is/) into your Nuxt websites/applications.

## 🚀 Try it online

<a href="https://stackblitz.com/edit/nuxt-umami"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz"></a>

## ✨ Get started

Install and add to Nuxt with one command

```sh
npx nuxi module add nuxt-umami
```

## 📖 Config options, Usage, and FAQs

[Read the full documentation.](https://umami.nuxt.dev/)

## Configure

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-umami'],
  umami: {
    // `host` is the URL of your Umami server (where analytics data is sent to) —
    // e.g. https://cloud.umami.is or https://analytics.mycompany.com.
    // It is NOT the URL of the site being tracked.
    host: 'https://your-umami-instance.example.com',
    id: 'your-website-id',
    autoTrack: true,
    // proxy: 'cloak',       // hide your Umami endpoint from the browser
    // useDirective: true,   // enable v-umami directive
    // ignoreLocalhost: true,
    // domains: ['mysite.com'],  // allow-list of hostnames the tracker runs on
  },
});
```

Key fields:

- **`host`** — the Umami server's origin. Paired with `customEndpoint` (default `/api/send`
  for Umami v2) to form the URL the tracker POSTs events to.
- **`id`** — the website ID from your Umami dashboard, attached to every event.
- **`domains`** — optional allow-list of hostnames (the *tracked* site's hostnames) where
  the tracker is permitted to run. Leave unset to run everywhere.

The `host` and `id` values above are used at build time as the defaults. Depending on the
`proxy` mode, some or all of them can also be overridden at **server start** without
rebuilding — see below.

Full configuration reference: [umami.nuxt.dev/api/configuration](https://umami.nuxt.dev/api/configuration)

## Proxy modes

The `proxy` option picks how tracking requests reach your Umami server, and determines
which env vars (if any) can change the target at runtime vs. only at build time.

| `proxy`          | How requests flow                                               | Website ID baked into client | Upstream URL baked into |
|------------------|------------------------------------------------------------------|------------------------------|--------------------------|
| `false` *(default)* | Browser → Umami directly                                      | yes (public)                 | client bundle (public)   |
| `'direct'`       | Browser → `/api/savory` → Nuxt `routeRules` proxy → Umami        | yes (public)                 | server at build time *(see below)* |
| `'cloak'`        | Browser → `/api/savory` → server handler → Umami                 | no (server-only)             | server at runtime        |

## Environment variables

Use the set that matches your `proxy` setting. Values not listed are not overridable at
runtime in that mode.

**`proxy: false` — direct, no proxy**

The website ID and full endpoint URL are sent to the browser in the public bundle, and
both are overridable at server start:

```sh
NUXT_PUBLIC_UMAMI_WEBSITE=your-website-id
NUXT_PUBLIC_UMAMI_ENDPOINT=https://your-umami-instance.example.com/api/send
```

`NUXT_PUBLIC_UMAMI_ENDPOINT` is the fully-resolved URL including path. It's equivalent to
`host` + `customEndpoint` (defaulting to `/api/send` for Umami v2).

**`proxy: 'cloak'` — server-side proxy, endpoint hidden from the browser**

The real Umami URL and website ID live in server-only runtime config and never reach the
client. Both are overridable at server start:

```sh
NUXT_UMAMI_WEBSITE=your-website-id
NUXT_UMAMI_ENDPOINT=https://your-umami-instance.example.com/api/send
```

The browser always POSTs to `/api/savory` on your own domain; the server handler forwards
to `NUXT_UMAMI_ENDPOINT`.

**`proxy: 'direct'` — Nuxt `routeRules` proxy (partial runtime override)**

The browser POSTs to `/api/savory`, which Nuxt rewrites to the upstream Umami URL via
[`routeRules`](https://nuxt.com/docs/guide/concepts/rendering#route-rules). Because
`routeRules` is resolved at build time, **the upstream URL cannot be changed without a
rebuild**. Only the website ID is runtime-overridable:

```sh
NUXT_PUBLIC_UMAMI_WEBSITE=your-website-id
# NUXT_PUBLIC_UMAMI_ENDPOINT is ignored/harmful in this mode — do not set it.
# Changing host/customEndpoint requires rebuilding.
```

**Tag (optional, all modes)**

```sh
NUXT_PUBLIC_UMAMI_TAG=my-tag
```

## Usage

All composables are auto-imported. See [umami.nuxt.dev/api/usage](https://umami.nuxt.dev/api/usage) for the full API.

```ts
// Track a page view (called automatically if autoTrack: true)
umTrackView();

// Track a named event with optional data
umTrackEvent('signup-click', { plan: 'pro' });

// Identify an authenticated user (SaaS portal use case)
umIdentify('[email protected]');
umIdentify('[email protected]', { plan: 'pro', company: 'Acme' });

// Track revenue
umTrackRevenue('subscription', 49, 'USD');
```

<hr />

MIT License ©2022-PRESENT [ML](https://github.com/ijkml/)
