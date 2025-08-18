<script setup lang="ts">
import { useAttrs } from 'vue'
import svgPaths from '@/imports/svg-ycmq5i0px2'

const props = withDefaults(
  defineProps<{
    className?: string
  }>(),
  {
    className: '',
  },
)

const attrs = useAttrs()
</script>

<template>
  <div class="absolute overflow-hidden" :class="props.className" v-bind="attrs">
    <svg
      class="w-full h-full opacity-10"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 306 84"
    >
      <g>
        <path :d="(svgPaths as any).p161ca900" fill="#967AFE" />
        <path :d="(svgPaths as any).p2038d800" fill="#967AFE" />
        <path :d="(svgPaths as any).p32f30500" fill="#FBEB6F" />
        <path :d="(svgPaths as any).p33ff8b00" fill="#48D19C" />
        <path :d="(svgPaths as any).pec55180" fill="#48D19C" />
        <path :d="(svgPaths as any).p372f9f00" fill="#9AD0F0" />
        <path :d="(svgPaths as any).p8d5f400" fill="#FFAF54" />
        <path :d="(svgPaths as any).p35a2c700" fill="#9AD0F0" />
        <path :d="(svgPaths as any).p1504e700" fill="#967AFE" />
        <path :d="(svgPaths as any).p38901900" fill="#FBEB6F" />
        <path :d="(svgPaths as any).pe448ec0" fill="#FFAF54" />
      </g>
    </svg>
  </div>
</template>
