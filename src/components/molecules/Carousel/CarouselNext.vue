<script setup lang="ts">
import { inject } from 'vue'
import { CAROUSEL_CTX } from './context'
import Button from '@/components/atoms/Button.vue'
import { ArrowRight } from 'lucide-vue-next'
import { cn } from '@/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link' | undefined
    size?: 'icon' | 'default' | 'sm' | 'lg' | undefined
  }>(),
  {
    class: '',
    variant: 'outline',
    size: 'icon',
  },
)
const ctx = inject(CAROUSEL_CTX)
if (!ctx) throw new Error('CarouselNext must be used within Carousel')
</script>

<template>
  <Button
    data-slot="carousel-next"
    :variant="props.variant"
    :size="props.size"
    :class="
      cn(
        'absolute size-8 rounded-full',
        ctx.orientation === 'horizontal'
          ? 'top-1/2 -right-12 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        props.class,
      )
    "
    :disabled="!ctx.canScrollNext"
    @click="ctx.scrollNext()"
  >
    <ArrowRight />
    <span class="sr-only">Next slide</span>
  </Button>
</template>
