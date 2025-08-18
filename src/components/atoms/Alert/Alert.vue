<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { alertVariants } from './alertVariants.ts'
import { cn } from '@/utils'
// Avoid using VariantProps here to prevent Vue SFC type resolver issues in dev.
// Explicitly type the supported variants from alertVariants.
const props = defineProps<{
  class?: string
  variant?: 'default' | 'destructive'
}>()
</script>

<template>
  <div
    data-slot="alert"
    role="alert"
    :class="cn(alertVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </div>
</template>
