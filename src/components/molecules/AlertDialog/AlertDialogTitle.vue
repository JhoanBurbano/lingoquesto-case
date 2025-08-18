<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <h2 data-slot="alert-dialog-title" :class="cn('text-lg font-semibold', $props.class)">
    <slot />
  </h2>
</template>
