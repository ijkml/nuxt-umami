<script setup>
const {$umami} = useNuxtApp();

onMounted(() => {
console.info($umami);
});

// $umami.trackEvent();
</script>

<template>
  <div>
    Nuxt module playground!
  </div>
</template>
