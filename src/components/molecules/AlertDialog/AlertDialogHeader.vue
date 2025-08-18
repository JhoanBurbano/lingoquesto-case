<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    data-slot="alert-dialog-header"
    :class="cn('flex flex-col gap-2 text-center sm:text-left', $props.class)"
  >
    <slot />
  </div>
</template>
