<script setup lang="ts">
import { inject } from 'vue'
import { CAROUSEL_CTX } from './context'
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
const ctx = inject(CAROUSEL_CTX)
if (!ctx) throw new Error('CarouselContent must be used within Carousel')
</script>

<template>
  <div ref="ctx.viewportRef" class="overflow-hidden" data-slot="carousel-content">
    <div
      :class="
        cn('flex', ctx.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', props.class)
      "
    >
      <slot />
    </div>
  </div>
</template>
