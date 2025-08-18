<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    data-slot="alert-dialog-footer"
    :class="cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', $props.class)"
  >
    <slot />
  </div>
</template>
