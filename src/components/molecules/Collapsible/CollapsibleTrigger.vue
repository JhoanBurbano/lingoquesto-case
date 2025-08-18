<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const props = defineProps<{ as?: string }>()
const Tag = (props.as || 'button') as any
</script>

<template>
  <Tag data-slot="collapsible-trigger">
    <slot />
  </Tag>
</template>
