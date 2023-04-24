<script setup lang="ts">
const route = useRoute();

const title = computed(() => {
  return route.path.slice(1, 2).toUpperCase() + route.path.slice(2).replace('-', ' ');
});
</script>

<template>
  <h2 v-text="title" />
</template>
