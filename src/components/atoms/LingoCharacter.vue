<script setup lang="ts">
import { useAttrs } from 'vue'
import svgPaths from '@/imports/svg-ycmq5i0px2'

const props = withDefaults(
  defineProps<{
    variant?: 'happy' | 'celebrating' | 'teaching'
    className?: string
    animated?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    variant: 'happy',
    className: '',
    animated: false,
    size: 'md',
  },
)

const attrs = useAttrs()

// Tailwind size tokens for the component footprint
const SIZE_TOKENS = {
  sm: 'size-12',
  md: 'size-16',
  lg: 'size-24',
  xl: 'size-80',
} as const
</script>

<template>
  <div
    class="relative"
    :class="[SIZE_TOKENS[props.size], props.className, props.animated ? 'animate-bounce' : '']"
    v-bind="attrs"
  >
    <!-- Character background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#967AFE] to-[#FFAF54] rounded-full opacity-20"
    />

    <!-- Main character body -->
    <svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 96 94">
      <g>
        <path :d="(svgPaths as any).pd81cb00" fill="#967AFE" />
        <path :d="(svgPaths as any).p3c20c000" fill="black" />
        <path :d="(svgPaths as any).p2694e900" :fill="'url(#paint0_linear_character)'" />
        <path :d="(svgPaths as any).p31468800" :fill="'url(#paint1_linear_character)'" />
        <path :d="(svgPaths as any).p23213600" fill="#967AFE" />
        <path :d="(svgPaths as any).p1a125800" fill="black" />
        <path :d="(svgPaths as any).p281f8680" fill="black" />
        <path :d="(svgPaths as any).p8c28200" fill="black" />
        <path :d="(svgPaths as any).p39687280" fill="black" />
        <path :d="(svgPaths as any).p3234db00" fill="black" />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_character"
          x1="79.3326"
          x2="31.6757"
          y1="26.2043"
          y2="119.703"
        >
          <stop offset="0.447743" stop-color="#967AFE" />
          <stop offset="1" stop-color="#FFAF54" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_character"
          x1="85.1706"
          x2="124.039"
          y1="82.6371"
          y2="82.5612"
        >
          <stop offset="0.25" stop-color="#967AFE" />
          <stop offset="1" stop-color="#FFAF54" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Celebration confetti for celebrating variant -->
    <div v-if="props.variant === 'celebrating'" class="absolute -inset-2">
      <svg
        class="w-full h-full animate-pulse"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 306 84"
      >
        <g opacity="0.6">
          <path :d="(svgPaths as any).p161ca900" fill="#967AFE" />
        </g>
        <g opacity="0.6">
          <path :d="(svgPaths as any).p32f30500" fill="#FBEB6F" />
          <path :d="(svgPaths as any).p33ff8b00" fill="#48D19C" />
          <path :d="(svgPaths as any).p8d5f400" fill="#FFAF54" />
        </g>
      </svg>
    </div>
  </div>
</template>
