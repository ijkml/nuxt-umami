<script setup>
// onMounted(() => {});

function testView() {
  umTrackView();
}
function testEvent() {
  umTrackEvent('event-test-1', { type: 'click', position: 'left' });
}
</script>

<template>
  <div class="page-root">
    <div class="page-container">
      <h1>Nuxt Umami</h1>
      <br>
      <button @click="testEvent">
        Run trackEvent
      </button>
      <button @click="testView">
        Run trackView
      </button>
      <a href="https://ml-umami.netlify.app/share/8o0OFImY/Umami%20Next" target="_blank" rel="noopener noreferrer">See Preview</a>

      <br>

      <NuxtLink to="/page-1">
        Page 1
      </NuxtLink>
      <NuxtLink to="/page-2">
        Page 2
      </NuxtLink>
      <NuxtLink to="/page-3">
        Page 3
      </NuxtLink>
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
  font-size: x-large;
  font-weight: 600;
}

:is(button, a) {
  padding: 8px 12px;
  margin: 16px;
  outline: none;
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: 6px;
  width: auto;
  height: auto;
  background-color: whitesmoke;
  transition: all 350ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

:is(button, a):is(:hover, :focus-visible) {
  background-color: rgb(209, 209, 209);
  outline: none;
}
</style>
