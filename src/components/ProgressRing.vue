<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :stroke="bgColor"
        fill="transparent"
        :stroke-width="strokeWidth"
        :r="normalizedRadius"
        :cx="size / 2"
        :cy="size / 2"
      />
      <circle
        :stroke="ringColor"
        fill="transparent"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circ"
        :stroke-dashoffset="dash"
        stroke-linecap="round"
        :r="normalizedRadius"
        :cx="size / 2"
        :cy="size / 2"
        class="transition-all duration-300"
      />
    </svg>
    <span class="absolute text-xs font-semibold text-gray-700">{{ Math.round(progress) }}%</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ progress: number; size?: number; strokeWidth?: number; bgColor?: string }>(),
  {
    size: 60,
    strokeWidth: 4,
    bgColor: '#e5e7eb',
  },
)
const normalizedRadius = computed(() => (props.size - props.strokeWidth) / 2)
const circ = computed(() => normalizedRadius.value * 2 * Math.PI)
const dash = computed(() => circ.value - (props.progress / 100) * circ.value)
const ringColor = computed(() =>
  props.progress >= 80 ? '#10b981' : props.progress >= 60 ? '#f59e0b' : '#ef4444',
)
</script>
