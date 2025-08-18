<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string | string[] | Record<string, boolean> }>()
</script>

<template>
  <div
    data-slot="avatar-fallback"
    :class="
      cn(
        'bg-muted flex size-full items-center justify-center rounded-full w-full h-full',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
