<script setup lang="ts">
import { useAttrs } from 'vue'
import svgPaths from '@/imports/svg-ycmq5i0px2'

const props = withDefaults(
  defineProps<{
    className?: string
  }>(),
  {
    className: 'w-12 h-12',
  },
)

const attrs = useAttrs()
</script>

<template>
  <RouterLink to="/dashboard">
    <div class="relative" :class="[props.className]" v-bind="attrs">
      <div class="absolute inset-0 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-xl" />
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" preserveAspectRatio="none" viewBox="0 0 151 122">
          <g>
            <path :d="(svgPaths as any).p1a4be500" fill="black" />
            <path :d="(svgPaths as any).p287b7900" fill="white" />
            <path :d="(svgPaths as any).p1ea77400" fill="white" />
          </g>
        </svg>
      </div>
    </div>
  </RouterLink>
</template>
