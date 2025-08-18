<script setup lang="ts">
import { cn } from '@/utils'
defineProps<{ class?: string }>()
</script>
<template>
  <h2 data-slot="dialog-title" :class="cn('text-lg leading-none font-semibold', $props.class)">
    <slot />
  </h2>
</template>
