<template>
  <div class="flex items-center gap-3 bg-[#F9F6FF] rounded-xl p-4 border border-[#967AFE]/20">
    <div
      class="flex items-center justify-center w-10 h-10 rounded-full"
      :class="isActive ? 'bg-gradient-to-r from-[#967AFE] to-[#48D19C]' : 'bg-gray-300'"
    >
      <Mic class="w-5 h-5" :class="isActive ? 'text-white' : 'text-gray-500'" />
    </div>

    <div class="flex items-center gap-1 flex-1">
      <div
        v-for="(amp, i) in waveform"
        :key="i"
        class="w-1 rounded-full"
        :class="isActive ? 'bg-gradient-to-t from-[#967AFE] to-[#48D19C]' : 'bg-gray-300'"
        :style="barStyle(i, amp)"
      />
    </div>

    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600 min-w-[3rem]">{{ duration }}</span>
      <button
        v-if="onPlay || onPause"
        @click="isPlaying ? onPause?.() : onPlay?.()"
        class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white"
      >
        <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Mic, Play, Pause } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    isActive: boolean
    duration: string
    waveform?: number[]
    onPlay?: () => void
    onPause?: () => void
    isPlaying?: boolean
  }>(),
  {
    waveform: () => [0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.2, 0.5, 0.7],
    isPlaying: false,
  },
)
const barStyle = (i: number, amp: number) => ({
  height: props.isActive && props.isPlaying ? `${amp * 24}px` : '8px',
  transition: 'height .2s ease',
  marginLeft: '2px',
  marginRight: '2px',
})
</script>
