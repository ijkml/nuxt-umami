# Nuxt Umami

[![License](https://img.shields.io/npm/l/nuxt-umami?style=flat-square)](https://github.com/ijkml/nuxt-umami/blob/main/LICENSE)

Integrate [**Umami Analytics**](https://umami.is/) into your Nuxt websites/applications.

---

## Fork: colinmollenhour/nuxt-umami

This fork adds several bug fixes and improvements on top of the upstream
[ijkml/nuxt-umami](https://github.com/ijkml/nuxt-umami) v3.2.1.
Use this if you need:

- Distinct user ID support in `umIdentify` for authenticated SaaS users (Umami v2.18.0+)
- Accurate geo-location when using `proxy: 'cloak'` on Netlify/Vercel
- Fixed duplicate pageview tracking with nested `<NuxtPage>` layouts
- True runtime env var support — change Umami endpoint/ID at server start without rebuilding

### Install this fork

Install from the release tarball (the only supported method — `dist/` is not committed to git):

```sh
pnpm add https://github.com/colinmollenhour/nuxt-umami/releases/download/v3.4.0/nuxt-umami-v3.4.0.tgz
# or
npm install https://github.com/colinmollenhour/nuxt-umami/releases/download/v3.4.0/nuxt-umami-v3.4.0.tgz
# or
yarn add https://github.com/colinmollenhour/nuxt-umami/releases/download/v3.4.0/nuxt-umami-v3.4.0.tgz
```

> **Note:** Because this fork is not published to npm, `npx nuxi module add` will not
> work. Register the module manually as shown below.

### Configure

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

### Proxy modes

The `proxy` option picks how tracking requests reach your Umami server, and determines
which env vars (if any) can change the target at runtime vs. only at build time.

| `proxy`          | How requests flow                                               | Website ID baked into client | Upstream URL baked into |
|------------------|------------------------------------------------------------------|------------------------------|--------------------------|
| `false` *(default)* | Browser → Umami directly                                      | yes (public)                 | client bundle (public)   |
| `'direct'`       | Browser → `/api/savory` → Nuxt `routeRules` proxy → Umami        | yes (public)                 | server at build time *(see below)* |
| `'cloak'`        | Browser → `/api/savory` → server handler → Umami                 | no (server-only)             | server at runtime        |

### Environment variables

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

### Usage

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

### Fork changes vs upstream v3.2.1

| Change | Description |
|--------|-------------|
| SPA referral attribution | `?ref=` param was sent on every page, not just the landing page |
| Duplicate pageview | Nested `<NuxtPage>` caused double-tracking per navigation |
| `umIdentify` distinct ID | Added `(id)` and `(id, data)` signatures; ID auto-included in all subsequent events |
| Cloak proxy geo-location | `X-Forwarded-For` now forwarded so Umami sees the real client IP |
| Event name length | Names over 50 chars are warned and pre-truncated to match Umami's server limit |
| Currency normalization | `umTrackRevenue` now always emits uppercase currency codes |
| Nuxt v4 peer deps | `@nuxt/kit`/`@nuxt/schema` ranges broadened to `>=3.15.4` |
| Runtime config typing | `runtimeConfig.umami` is now properly typed via module augmentation |
| Structured logging | Module setup uses `useLogger` from `@nuxt/kit` instead of `console.warn` |
| Proxy validator | Body key-count check removed; forward-compatible with Umami API additions |
| Runtime env vars | Config moved to Nuxt `runtimeConfig`. `proxy: false` → `NUXT_PUBLIC_UMAMI_WEBSITE`/`_ENDPOINT` override at server start. `proxy: 'cloak'` → `NUXT_UMAMI_WEBSITE`/`_ENDPOINT` do the same, server-only. `proxy: 'direct'` → only `NUXT_PUBLIC_UMAMI_WEBSITE` is runtime-overridable; the upstream URL is baked into `routeRules` at build time. |

---

## Prompt for AI assistants

Use this prompt when setting up this module in a new project:

---

> Install the `colinmollenhour/nuxt-umami` fork of the nuxt-umami module. This is a
> fork of [ijkml/nuxt-umami](https://github.com/ijkml/nuxt-umami) with additional bug
> fixes; the full API and configuration docs are at https://umami.nuxt.dev/ but
> installation differs from the official docs.
>
> **Install from the release tarball** (the only supported method — `npx nuxi module add`
> and `github:` installs do not work for this fork):
> ```sh
> pnpm add https://github.com/colinmollenhour/nuxt-umami/releases/download/v3.4.0/nuxt-umami-v3.4.0.tgz
> ```
>
> **Register in `nuxt.config.ts`:**
> ```ts
> export default defineNuxtConfig({
>   modules: ['nuxt-umami'],
>   umami: {
>     host: 'https://your-umami-instance.example.com',
>     id: 'your-website-id',
>     autoTrack: true,
>     proxy: 'cloak',
>   },
> });
> ```
>
> **Environment variables** — at server start (no rebuild), use the set that matches your
> `proxy` setting:
> ```sh
> # proxy: false (default) — browser talks to Umami directly
> NUXT_PUBLIC_UMAMI_WEBSITE=your-website-id
> NUXT_PUBLIC_UMAMI_ENDPOINT=https://your-umami-instance.example.com/api/send
>
> # proxy: 'cloak' — server-only, never exposed to the client
> NUXT_UMAMI_WEBSITE=your-website-id
> NUXT_UMAMI_ENDPOINT=https://your-umami-instance.example.com/api/send
>
> # proxy: 'direct' — only the website ID is runtime-overridable;
> # the upstream URL is baked into Nuxt routeRules at build time.
> NUXT_PUBLIC_UMAMI_WEBSITE=your-website-id
> ```
>
> **Auto-imported composables** (no imports needed in `<script setup>`):
> - `umTrackView(path?, referrer?)` — track a page view
> - `umTrackEvent(name, data?)` — track a named event; `name` max 50 chars
> - `umIdentify(userId)` / `umIdentify(userId, data)` / `umIdentify(data)` — identify
>   the current user; the ID persists across all subsequent events in the session
> - `umTrackRevenue(name, amount, currency?)` — track a revenue event
>
> **Directive** (enable with `useDirective: true` in config):
> ```html
> <button v-umami="'cta-click'">Get started</button>
> ```
>
> Full config and usage docs: https://umami.nuxt.dev/api/configuration and
> https://umami.nuxt.dev/api/usage

---

<hr />

MIT License ©2022-PRESENT [ML](https://github.com/ijkml/)
