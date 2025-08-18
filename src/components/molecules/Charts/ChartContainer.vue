<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@/utils'
import { provideChart, type ChartConfig } from './useChart'
import { buildChartStyle } from './chartStyle'

const props = defineProps<{
  id?: string
  class?: string
  config: ChartConfig
}>()

const chartId = ref(props.id || `chart-${Math.random().toString(36).slice(2)}`)
const css = ref('')
const styleEl = ref<HTMLStyleElement | null>(null)

onMounted(() => {
  css.value = buildChartStyle(chartId.value, props.config)
  const el = document.createElement('style')
  el.setAttribute('data-chart-style', chartId.value)
  el.textContent = css.value
  document.head.appendChild(el)
  styleEl.value = el
})

watch(css, (val) => {
  if (styleEl.value) styleEl.value.textContent = val
})

onBeforeUnmount(() => {
  if (styleEl.value?.parentNode) styleEl.value.parentNode.removeChild(styleEl.value)
  styleEl.value = null
})
provideChart({ config: props.config })
</script>

<template>
  <div
    data-slot="chart"
    :data-chart="chartId"
    :class="
      cn(
        '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke=\'#ccc\']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke=\'#ccc\']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke=\'#ccc\']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke=\'#fff\']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke=\'#fff\']]:stroke-transparent [&_.recharts-surface]:outline-hidden',
        props.class,
      )
    "
  >
    <!-- Dentro de este slot renderiza tu librería de charts (ej. ECharts, Apex, etc.) -->
    <slot />
  </div>
</template>
