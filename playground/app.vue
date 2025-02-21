<script setup lang="ts">
const { shareUrl } = useAppConfig();

function testView() {
  umTrackView().then(({ ok }) => {
    console.log(ok ? 'That went well ;)' : `Oops, that didn't go as planned`);
  });
}

function testEvent() {
  umTrackEvent('event-test-2', { type: 'click', position: 'left' });
}

const tt = ref('TT');
const tc = ref(0);

const directiveBtns = computed(() => [
  { text: 'Test Directive 1', action: 'test-directive' },
  { text: `Test Directive ${tc.value}`, action: { name: 'Reactive Action', id: tt.value } },
]);

function updateRefs() {
  tc.value++;
  tt.value = `TT-${tc.value}`;
}

function seePreview() {
  umTrackEvent('see-preview', { from: 'localhost' });
}

// is disabled via localStorage
const localStorageToggle = ref(false);
let storage: Storage | undefined;

watch(localStorageToggle, (status) => {
  storage?.setItem('umami.disabled', String(+status));
});

onMounted(() => {
  storage = localStorage;
  localStorageToggle.value = storage?.getItem('umami.disabled') === '1';
});
</script>

<template>
  <div class="page-root">
    <main
      id="main"
      class="page-container"
    >
      <h1>Nuxt Umami</h1>

      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>

      <div class="deck">
        <button @click="testEvent">
          Run trackEvent
        </button>
        <button @click="testView">
          Run trackView
        </button>
        <a
          :href="shareUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="seePreview"
        >See Preview</a>
      </div>

      <div class="deck">
        <button
          v-for="btn in directiveBtns"
          :key="btn.text"
          v-umami="btn.action"
        >
          {{ btn.text }}
        </button>
        <button @click="updateRefs">
          Update Refs
        </button>
      </div>

      <div class="deck">
        <button @click="umTrackRevenue('buy-course', 49.95, 'USD')">
          Buy course: $49.95
        </button>
        <button @click="umTrackRevenue('buy-premium', 199.99, 'EUR')">
          Buy premium: £199.99
        </button>
        <button @click="umTrackRevenue('buy-coffee', 20, 'YEN')">
          Buy coffee: ¥20
        </button>
      </div>

      <div class="deck">
        <NuxtLink to="/">
          Homepage
        </NuxtLink>
        <NuxtLink
          v-for="i in 3"
          :key="i"
          :to="`/page-${i}`"
        >
          Page {{ i }}
        </NuxtLink>
        <NuxtLink
          :to="{
            query: { text: 'pro-max', sort: 'rating' },
            path: `page-${+($route.params.id || 0) + 1}`,
            hash: '#hashtag',
          }"
        >
          Search + Hash
        </NuxtLink>
      </div>

      <div class="deck">
        <div>
          <input
            id="umami-disabled"
            v-model="localStorageToggle"
            name="umami-disabled"
            type="checkbox"
          >
          <label for="umami-disabled">Disable Umami via localStorage</label>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  color-scheme: dark only;
  color: hsl(100, 10%, 90%);
  font-family: system-ui, sans-serif;
  font-size: 15px;
}

.page-root {
  background: linear-gradient(to bottom, hsl(88, 15%, 10%), hsl(0, 0%, 5%));
  min-height: 100vh;
  padding: 40px;
  display: grid;
  place-items: center;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

:is(button, a) {
  padding: 8px 12px;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  outline: none;
  cursor: pointer;
  border-radius: 6px;
  width: auto;
  height: auto;
  user-select: none;
  background-color: hsl(88, 25%, 10%);
  border: 1px solid hsl(88, 25%, 10%);
  transition: all 150ms ease;
  font-family: monospace;
  font-weight: 500;
  font-size: 0.85rem;
}

:is(button, a):is(:hover, :focus-visible) {
  border-color: hsl(88, 50%, 30%);
  outline: none;
}

:is(h2) {
  font-size: 1.5rem;
}

.deck {
  display: flex;
  padding: 8px;
  gap: 1rem;
  margin-top: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
}

input {
  margin: 0.4rem;
}

label,
input {
  user-select: none;
  cursor: pointer;
}
</style>
