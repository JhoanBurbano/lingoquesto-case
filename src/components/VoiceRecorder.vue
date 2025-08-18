<template>
  <div class="space-y-4">
    <!-- Recording Status -->
    <div
      v-if="recorder.isRecording.value"
      class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-3"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-2">
          <div class="flex space-x-1">
            <div
              v-for="i in 3"
              :key="i"
              class="w-1 h-4 bg-red-500 rounded-full animate-pulse"
              :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
            />
          </div>
          <span class="text-sm font-medium text-red-700"> Grabando... </span>
        </div>
        <span class="font-bold" :class="getDurationColor()">
          {{ formatDuration(recorder.durationSec.value) }}
        </span>
      </div>

      <!-- Progress bar -->
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r transition-all duration-300"
          :class="getProgressColor()"
          :style="{ width: `${getProgressPercentage()}%` }"
        />
      </div>

      <p class="text-xs text-red-600 mt-2 text-center">
        {{ Math.max(0, 30 - recorder.durationSec.value).toFixed(1) }}s restantes (máximo 30s)
      </p>
    </div>

    <!-- Recording Controls -->
    <div class="flex items-center justify-center space-x-4">
      <button
        @click="handleRecord"
        :disabled="isProcessing"
        class="w-16 h-16 rounded-full transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        :class="getButtonClasses()"
      >
        <div
          v-if="isProcessing"
          class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
        />
        <Square v-else-if="recorder.isRecording.value" class="w-8 h-8 text-white" />
        <Mic v-else class="w-8 h-8 text-white" />
      </button>
    </div>

    <!-- Instructions -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        {{
          recorder.isRecording.value
            ? 'Haz clic en el botón para detener la grabación'
            : 'Haz clic en el micrófono para comenzar a grabar'
        }}
      </p>
      <p v-if="!recorder.isRecording.value" class="text-xs text-gray-500 mt-1">
        Duración máxima: 30 segundos
      </p>
    </div>

    <!-- Warning for long recordings -->
    <div
      v-if="recorder.durationSec.value >= 25"
      class="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center"
    >
      <p class="text-sm text-orange-700 font-medium">
        ⚠️ La grabación se detendrá automáticamente en
        {{ (30 - recorder.durationSec.value).toFixed(1) }}s
      </p>
    </div>

    <!-- Error display -->
    <div
      v-if="recorder.error.value"
      class="bg-red-50 border border-red-200 rounded-xl p-3 text-center"
    >
      <p class="text-sm text-red-700 font-medium">
        {{ recorder.error.value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVoiceRecorder } from '@/composables/useVoiceRecorder'
import { useVoiceChatStore } from '@/stores/voiceChat'
import { Mic, Square } from 'lucide-vue-next'

interface Props {
  onMessageSent?: () => void
}

const props = defineProps<Props>()

const store = useVoiceChatStore()
const recorder = useVoiceRecorder({
  minDurationSec: 0.5,
  maxDurationSec: 30,
})
const isProcessing = ref(false)

const handleRecord = async () => {
  if (recorder.isRecording.value) {
    isProcessing.value = true

    try {
      const blob = await recorder.stop()
      store.stopRecording()

      if (blob && recorder.audioUrl.value) {
        store.addMessage({
          audioUrl: recorder.audioUrl.value,
          text: undefined,
        })

        // Emit event for parent component
        if (props.onMessageSent) {
          props.onMessageSent()
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
    } finally {
      isProcessing.value = false
    }
  } else {
    await recorder.start()
    if (!recorder.error.value) {
      store.startRecording()
    }
  }
}

const formatDuration = (seconds: number) => {
  return `${seconds.toFixed(1)}s`
}

const getDurationColor = () => {
  const duration = recorder.durationSec.value
  if (duration >= 25) return 'text-red-500'
  if (duration >= 20) return 'text-orange-500'
  return 'text-[#967AFE]'
}

const getProgressColor = () => {
  const duration = recorder.durationSec.value
  if (duration >= 25) return 'from-red-400 to-red-600'
  if (duration >= 20) return 'from-orange-400 to-orange-600'
  return 'from-[#967AFE] to-[#48D19C]'
}

const getProgressPercentage = () => {
  return (recorder.durationSec.value / 30) * 100
}

const getButtonClasses = () => {
  if (recorder.isRecording.value) {
    return 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
  }
  return 'bg-gradient-to-r from-[#967AFE] to-[#48D19C] hover:opacity-90 hover:scale-105'
}
</script>
