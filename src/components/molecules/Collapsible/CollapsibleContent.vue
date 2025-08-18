<script setup lang="ts">
defineProps<{ open?: boolean }>()
</script>

<template>
  <div v-show="open" data-slot="collapsible-content">
    <slot />
  </div>
</template>
