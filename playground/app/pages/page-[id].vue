<script setup lang="ts">
const title = `Page - ${useRoute().params.id || 'other'}`;

useHead({ title });
</script>

<template>
  <h2>{{ title }}</h2>
</template>
