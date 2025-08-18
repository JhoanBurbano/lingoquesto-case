<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <h4 data-slot="card-title" :class="cn('leading-none', props.class)">
    <slot />
  </h4>
</template>
