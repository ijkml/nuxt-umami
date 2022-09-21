<script setup>
const { $umami, provide } = useNuxtApp();

$umami('test-run-on-setup');

onMounted(() => {
  $umami('test-onMounted');
});

function runTrackEvent() {
  $umami.trackEvent('Test tracker', 'it-works');
}
</script>

<template>
  <div>
    Nuxt module playground! <br />
    <button @click="runTrackEvent">Click to run trackEvent</button>
  </div>
</template>

<style scoped>
div {
  border: thin solid rgba(128, 128, 128, 0.5);
  padding: 40px;
}

button {
  padding: 8px 12px;
  margin: 16px;
  outline: none;
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: 6px;
  background-color: whitesmoke;
  transition: all 350ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

button:is(:hover, :focus-visible) {
  background-color: rgb(209, 209, 209);
  outline: none;
}
</style>
