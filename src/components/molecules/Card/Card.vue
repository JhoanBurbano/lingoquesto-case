<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils'
const props = defineProps<{ class?: string }>()
</script>

<template>
  <div
    data-slot="card"
    :class="cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border', props.class)"
  >
    <slot />
  </div>
</template>
