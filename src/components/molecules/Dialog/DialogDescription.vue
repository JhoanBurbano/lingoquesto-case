<script setup lang="ts">
import { cn } from '@/utils'
defineProps<{ class?: string }>()
</script>
<template>
  <div data-slot="dialog-description" :class="cn('text-muted-foreground text-sm', $props.class)">
    <slot />
  </div>
</template>
