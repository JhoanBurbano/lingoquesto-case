<script setup lang="ts">
import { inject } from 'vue'
import { CAROUSEL_CTX } from './context'
import { cn } from '@/utils'

const props = defineProps<{ class?: string }>()
const ctx = inject(CAROUSEL_CTX)
if (!ctx) throw new Error('CarouselItem must be used within Carousel')
</script>

<template>
  <div
    role="group"
    aria-roledescription="slide"
    data-slot="carousel-item"
    :class="
      cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        ctx.orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
