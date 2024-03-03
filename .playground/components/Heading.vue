<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <h2 v-text="title" />
</template>
