# nuxt-umami TODO

> Research date: March 2026  
> Sources: GitHub PRs/issues, upstream forks, Umami tracker docs, Nuxt v4 upgrade guide  
> Use case focus: SaaS homepage, portal, and docs site

---

## Progress checklist

Priority 1 — Critical bug fixes

- [x] 1.1 Merge PR #143: `umIdentify` distinct user ID support — commit `c1c94a0`
- [x] 1.2 Fix double `umTrackView` with nested `<NuxtPage>` — commit `83969be`
- [x] 1.3 Fix `queryRef` not resetting on SPA navigation — commit `b667f4d`

Priority 2 — Nuxt v4 compatibility

- [x] 2.1 Update peer dependency versions — commit `6df923b`
- [x] 2.2 Replace setTimeout hack with `page:loading:end` — Nuxt #26535 fixed by PR #29009, shipped in v3.15.2 / v4.0.0 (covered by our `>=3.15.4` peer dep)
- [x] 2.3 Type the `_proxyUmConfig` runtime config key properly — commit `b3eebb4` (renamed to `umami`)
- [x] 2.4 Replace `console.warn`/`console.info` with `useLogger` — commit `e0f354c`
- [x] 2.5 Update `meta.compatibility` declaration — commit `6df923b`
- [ ] 2.6 Migrate playground to Nuxt v4 `app/` directory structure — `playground/` still has top-level `app.vue`, `compatibilityDate` still `'2024-08-08'`

Priority 3 — Runtime config for multi-tenant SaaS (Issue #132)

- [x] Move `id`/`host` into `runtimeConfig` so `NUXT_(PUBLIC_)UMAMI_*` env vars override at server start — commit `be46242`

Priority 4 — Feature improvements

- [ ] 4.1 Support relative `host` path for same-origin proxy (Issue #144) — `module.ts:65` still does unconditional `new URL(host).origin`
- [x] 4.2 Forward client IP in `cloak` proxy (Issue #137) — commit `6dd3545`
- [x] 4.3 Add event name length validation (50-char limit) — commit `998e1e1`
- [x] 4.4 Fix `currency` regex case-insensitive flag — commit `1f8561d`
- [x] 4.5 Fix `CurrencyCode` type — missing letter `I` — commit `d7a14b8`
- [x] 4.6 Make proxy body validator forward-compatible — commit `e716f62`
- [ ] 4.7 Add `doNotTrack` browser setting support — no option or preflight check exists yet

---

## Priority 1 — Critical Bug Fixes

### 1.1 Merge PR #143: `umIdentify` distinct user ID support

**Status:** Open PR from `garretto`, closes issues #145 and #138  
**Files:** `src/types.ts:58`, `src/runtime/composables.ts:170`

This is the most important missing feature for a SaaS portal. Umami v2.18.0+ supports
associating events with a specific user ID, but `umIdentify` currently only accepts
session data — there is no way to pass a distinct ID string.

**Changes needed:**
- Add `id?: string` to `IdentifyPayload` in `src/types.ts:58`
- Add `parseEventBody` validator support for `id` field in `src/runtime/utils.ts:124`
- Update `umIdentify` to accept overloads:
  ```ts
  function umIdentify(uniqueId: string, sessionData?: EventData): FetchResult
  function umIdentify(sessionData?: EventData): FetchResult
  ```
- Store the ID in a module-level closure variable so it auto-includes in subsequent
  event payloads (matching official Umami tracker behavior)

**Why it matters for SaaS:** When a user logs into a portal, you want `umIdentify('[email protected]')` 
to associate all subsequent page views and events with that user for cohort analysis.

---

### 1.2 Fix double `umTrackView` with nested `<NuxtPage>` (Issue #141)

**Status:** Open issue, no PR yet  
**File:** `src/runtime/plugin.ts:15-18`

The `page:finish` hook fires once per `<NuxtPage>` component in nested routes, causing
duplicate pageview events that skew analytics data.

**Fix:** Track the last sent `route.fullPath` and deduplicate:
```ts
let lastTrackedPath: string | undefined;

nuxtApp.hook('page:finish', () => {
  const currentPath = nuxtApp.$router.currentRoute.value.fullPath;
  if (currentPath === lastTrackedPath) return;
  lastTrackedPath = currentPath;
  setTimeout(umTrackView, 250);
});
```

---

### 1.3 Fix `queryRef` not resetting on SPA navigation

**Status:** Bug (not yet reported as issue)  
**File:** `src/runtime/composables.ts:16-17`, `composables.ts:67-75`

`queryRef` is a module-level variable initialized once from the URL's `?ref=` or
`?referrer=` param. In a SPA, navigating away from the landing page still sends the
original referral source with every subsequent pageview, inflating referral attribution.

**Fix:** Reset `queryRef` after the first pageview send, or re-derive it on each
`umTrackView` call from the current route rather than memoizing it.

---

## Priority 2 — Nuxt v4 Compatibility

### 2.1 Update peer dependency versions

**File:** `package.json`

```json
// Current
"@nuxt/kit": "^3.15.4"  // devDep
"@nuxt/schema": "^3.15.4"  // devDep
"nuxt": "^3.15.4"  // devDep

// Required for v4
"@nuxt/kit": ">=3.15.4"
"@nuxt/schema": "^4.0.0"
"nuxt": "^4.0.0"
```

Also update `@nuxt/module-builder` to the latest version that supports v4.

---

### 2.2 Investigate `page:loading:end` hook as replacement for setTimeout hack

**File:** `src/runtime/plugin.ts:15-18`

There are multiple `// TODO` comments acknowledging the `setTimeout(umTrackView, 250)` 
hack used to wait for `useHead()` to update the page title after navigation. This was
a workaround for Nuxt bug #26535.

In Nuxt v4, `page:loading:end` is reported as fixed. If confirmed, replace:
```ts
// Current workaround
nuxtApp.hook('page:finish', () => {
  setTimeout(umTrackView, 250);
});

// Cleaner v4 approach (validate #26535 is fixed first)
nuxtApp.hook('page:loading:end', () => {
  umTrackView();
});
```

---

### 2.3 Type the `_proxyUmConfig` runtime config key properly

**Files:** `src/module.ts:123`, `src/runtime/server/endpoint.ts:24`

The `_proxyUmConfig` key is set on `runtimeConfig` without a declared type. In Nuxt v4
this generates TypeScript errors in strict mode. Declare it in the module options schema:

```ts
// In module.ts defineNuxtModule options
runtimeConfig: {
  umami: {
    endpoint: '',
    website: '',
    domains: '',
  }
}
```

Update `endpoint.ts:24` accordingly: `useRuntimeConfig().umami` instead of
`useRuntimeConfig()._proxyUmConfig`.

---

### 2.4 Replace `console.warn`/`console.info` with `useLogger`

**File:** `src/module.ts:108-119`

Nuxt v4 convention uses consola-based logging via `useLogger` from `@nuxt/kit`:
```ts
import { useLogger } from '@nuxt/kit'
const logger = useLogger('nuxt-umami')
logger.warn('id is missing...')
```

---

### 2.5 Update `meta.compatibility` declaration

**File:** `src/module.ts:21`

```ts
// Current
compatibility: { nuxt: '>=3' }

// Updated
compatibility: { nuxt: '>=3.0.0' }
```

---

### 2.6 Migrate playground to Nuxt v4 `app/` directory structure

**Files:** `playground/` directory, `playground/nuxt.config.ts`

Nuxt v4 defaults to `srcDir: 'app/'`. Either:
- Add `srcDir: '.'` to `playground/nuxt.config.ts` to opt out explicitly, OR
- Move `app.vue`, `pages/`, `assets/` into `playground/app/`

Also update the `compatibilityDate` in `playground/nuxt.config.ts` from `'2024-08-08'`
to a current date.

---

## Priority 3 — Runtime Config for Multi-Tenant SaaS (Issue #132)

**Status:** Open issue labeled `enhancement, help wanted`; PR #134 was closed without merge

The current architecture bakes `host` and `id` at **build time** via `addTemplate` 
generating `#build/umami.config.mjs`. This means a single Docker image cannot serve
multiple tenants with different Umami website IDs.

**Goal:** Allow `NUXT_PUBLIC_UMAMI_HOST` and `NUXT_PUBLIC_UMAMI_ID` environment variables
to work as true runtime overrides (read at server start, not build time).

**Approach:**
1. Move `id` and `host` into `runtimeConfig.public` instead of a build-time template
2. Access them via `useRuntimeConfig().public.umami` in the client runtime
3. Keep the current template approach as fallback for build-time config

This is non-trivial because the current `#build/umami.config.mjs` template is used in
client-side composables where `useRuntimeConfig()` is not always available (e.g., 
non-Nuxt contexts). A careful implementation is needed.

---

## Priority 4 — Feature Improvements

### 4.1 Support relative `host` path for same-origin proxy (Issue #144)

**Status:** Open issue, no PR

Users running Umami behind a reverse proxy at e.g. `/_umami` on the same domain as their
Nuxt app cannot currently configure `host: '/_umami'` — the module calls `new URL(host).origin`
which fails on relative paths.

**Use case:** A SaaS company that proxies Umami at `/_umami` on their app domain to avoid
ad-blocker detection without exposing the Umami cloud URL.

**Fix in:** `src/module.ts` — check if `host` starts with `/` and handle as relative path,
using `window.location.origin + host` at runtime.

---

### 4.2 Forward client IP in `cloak` proxy (Issue #137)

**Status:** Open issue

When using `proxy: 'cloak'` on Netlify/Vercel edge functions, all users appear to be
located at the server's IP (US datacenter) because Umami sees the proxy's IP, not the
end user's IP.

**Fix in:** `src/runtime/server/endpoint.ts` — forward `X-Forwarded-For` and `X-Real-IP`
headers from the incoming request to the Umami endpoint:

```ts
const clientIp = event.node.req.headers['x-forwarded-for'] 
  || event.node.req.headers['x-real-ip'];

if (clientIp) {
  headers['X-Forwarded-For'] = clientIp as string;
}
```

---

### 4.3 Add event name length validation (50-char limit)

**Status:** Not reported; identified from Umami docs  
**File:** `src/runtime/composables.ts:144`

Umami silently truncates event names longer than 50 characters. The current validation
only checks that the name is non-empty:

```ts
// Add length check
if (!isValidString(eventName) || eventName.length > 50) {
  logger('event-name');
  name = '#unknown-event';
}
```

---

### 4.4 Fix `currency` regex case-insensitive flag

**Status:** Minor bug  
**File:** `src/runtime/composables.ts:217`

The `i` flag makes the regex accept `usd`, `Usd`, etc., but the value is stored as-is:
```ts
// Current (buggy — stores mixed-case value)
if (/^[A-Z]{3}$/i.test(currency.trim())) {
  $cur = currency.trim();
}

// Fixed
if (/^[A-Z]{3}$/.test(currency.trim().toUpperCase())) {
  $cur = currency.trim().toUpperCase();
}
```

---

### 4.5 Fix `CurrencyCode` type — missing letter `I`

**Status:** Minor type bug  
**File:** `src/types.ts:72-76`

The `_Letter` union type that builds valid 3-letter currency codes is missing `I` 
(which is a valid ISO 4217 prefix — e.g., `INR`, `IDR`, `ILS`, `IQD`, `IRR`).

---

### 4.6 Make proxy body validator forward-compatible

**Status:** Low priority future-proofing  
**File:** `src/runtime/utils.ts:204`

The strict `Object.keys(body).length !== _bodyProps.length` check will silently reject
requests if the Umami API ever adds a new top-level field. Change to check for required
properties being present, not that no extra properties exist.

---

### 4.7 Add `doNotTrack` browser setting support

**Status:** Feature gap vs. Umami official tracker  
**Files:** `src/options.ts`, `src/runtime/composables.ts:29-43` (`runPreflight`)

The official Umami tracker supports `data-do-not-track="true"` which respects the
browser's `navigator.doNotTrack` header. The module has `ignoreLocalhost` but no DNT
support.

Add a `doNotTrack: boolean` option (default `false`) that, when `true`, checks
`navigator.doNotTrack === '1'` in `runPreflight()` and suppresses tracking.

---

## Informational / Won't Fix

### Forks analysis

Both `garretto/nuxt-umami` and `XStarlink/nuxt-umami` forks contain only **one change**
each — the same `src/module.ts` proxy SSR guard removal that was already merged into
`v3.2.1`. There is nothing to cherry-pick from these forks; the current codebase is
ahead of both.

### Batch event processing (Issue #136)

Umami v2 added batch API support. Closed without action upstream. Not relevant for a
standard SaaS analytics use case — only matters at very high event volumes.

### REST API for reading stats (Issue #109)

Out of scope — a separate package/module concern. Use Umami's REST API directly if you
need to display analytics data in your app.

### Stale dev branches

`feb-update` and `new-features` branches are stale — their content was already merged
into `main`. Safe to delete.

---

## Implementation Order (Recommended)

1. **Fix `queryRef` SPA referrer bug** (10 min, 1 file) — silent data corruption
2. **Fix nested `<NuxtPage>` double tracking** (15 min, 1 file) — visible skew in data
3. **Merge PR #143 source changes** (umIdentify distinct ID) — critical for portal
4. **Nuxt v4 peer deps + compatibility meta** (30 min) — unblocks v4 users
5. **Type `_proxyUmConfig` properly** (30 min, 2 files) — TypeScript correctness
6. **Forward client IP in cloak proxy** (20 min, 1 file) — geo-location accuracy
7. **Replace `console.warn` with `useLogger`** (15 min, 1 file) — convention
8. **Event name 50-char validation** (5 min, 1 file) — developer experience
9. **Currency regex fix** (5 min, 1 file) — silent bug
10. **`page:loading:end` hook investigation** (research first, then implement)
11. **Relative host path support** (Issue #144) — proxy ergonomics
12. **Runtime config for multi-tenant** (Issue #132) — architecture change, plan carefully
