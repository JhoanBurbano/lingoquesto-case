<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    data-slot="alert-dialog-description"
    :class="cn('text-muted-foreground text-sm', $props.class)"
  >
    <slot />
  </div>
</template>
