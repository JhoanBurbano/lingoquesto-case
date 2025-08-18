<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide, ref, watch } from 'vue'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { useEmbla, type CarouselApi } from '@/composables/useEmbla'
import { CAROUSEL_CTX } from './context'
import { cn } from '@/utils'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    opts?: EmblaOptionsType
    plugins?: EmblaPluginType[]
    class?: string
    setApi?: (api: CarouselApi | null) => void
  }>(),
  {
    orientation: 'horizontal',
    opts: undefined,
    plugins: undefined,
    class: '',
    setApi: undefined,
  },
)

const { viewportRef, api } = useEmbla(
  {
    ...props.opts,
    axis: props.orientation === 'horizontal' ? 'x' : 'y',
  },
  props.plugins,
)

const canScrollPrev = ref(false)
const canScrollNext = ref(false)

function onSelect(a: CarouselApi | null) {
  if (!a) return
  canScrollPrev.value = a.canScrollPrev()
  canScrollNext.value = a.canScrollNext()
}

const scrollPrev = () => api.value?.scrollPrev()
const scrollNext = () => api.value?.scrollNext()

onMounted(() => {
  props.setApi?.(api.value)
  onSelect(api.value || null)
  api.value?.on('reInit', () => onSelect(api.value))
  api.value?.on('select', () => onSelect(api.value))
})
onBeforeUnmount(() => props.setApi?.(null))
watch(api, (v) => props.setApi?.(v || null))

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    scrollPrev()
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    scrollNext()
  }
}

provide(CAROUSEL_CTX, {
  viewportRef,
  api,
  orientation: props.orientation,
  scrollPrev,
  scrollNext,
  canScrollPrev,
  canScrollNext,
  opts: props.opts,
  plugins: props.plugins,
})
</script>

<template>
  <div
    :class="cn('relative', props.class)"
    role="region"
    aria-roledescription="carousel"
    data-slot="carousel"
    @keydown.capture="onKeydown"
  >
    <slot />
  </div>
</template>
