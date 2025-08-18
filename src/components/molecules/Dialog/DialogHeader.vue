<script setup lang="ts">
import { cn } from '@/utils'
defineProps<{ class?: string }>()
</script>
<template>
  <div
    data-slot="dialog-header"
    :class="cn('flex flex-col gap-2 text-center sm:text-left', $props.class)"
  >
    <slot />
  </div>
</template>
