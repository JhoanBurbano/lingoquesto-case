<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <li data-slot="breadcrumb-item" :class="cn('inline-flex items-center gap-1.5', props.class)">
    <slot />
  </li>
</template>
