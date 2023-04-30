<script setup lang="ts">
function testView() {
  umTrackView();
}

function testEvent() {
  umTrackEvent('event-test-2', { type: 'click', position: 'left' });
}
</script>

<template>
  <div class="page-root">
    <div class="page-container">
      <h1>Nuxt Umami</h1>
      <br>

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
        <a href="https://ml-umami.netlify.app/share/8o0OFImY/Umami%20Next" target="_blank" rel="noopener noreferrer">See Preview</a>
      </div>

      <div class="deck">
        <NuxtLink to="/">
          Homepage
        </NuxtLink>
        <NuxtLink v-for="i in 3" :key="i" :to="`/page-${i}`">
          Page {{ i }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style src="./reset.css"></style>

<style scoped>
.page-root {
  background: linear-gradient(to bottom right, burlywood, aliceblue);
  min-height: 100vh;
  padding: 40px;
  display: grid;
  place-items: center;
  text-align: center;
  font-family: "Source Sans Pro", system-ui, -apple-system, Ubuntu, sans-serif;
}

h1 {
  font-size: xx-large;
  font-weight: 700;
}

:is(button, a) {
  padding: 8px 12px;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  outline: none;
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: 6px;
  width: auto;
  height: auto;
  user-select: none;
  background-color: whitesmoke;
  transition: all 350ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  font-family: monospace;
}

:is(button, a):is(:hover, :focus-visible) {
  background-color: rgb(209, 209, 209);
  outline: none;
}

:deep(h2) {
  font-size: x-large;
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
</style>
