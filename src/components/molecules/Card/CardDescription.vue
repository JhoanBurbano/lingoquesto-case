<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <p data-slot="card-description" :class="cn('text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
