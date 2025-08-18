<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    data-slot="avatar"
    :class="
      cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', ...(props.class || []))
    "
  >
    <slot />
  </div>
</template>
