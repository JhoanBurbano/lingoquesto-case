<template>
  <div class="flex" :class="isOwn ? 'justify-end' : 'justify-start'">
    <div class="max-w-xs w-full" :class="isOwn ? 'order-2' : 'order-1'">
      <div class="p-3 shadow-sm rounded-xl" :class="getMessageClasses()">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-sm" :class="getTextClasses()">
              {{ isOwn ? 'Tú' : message.user?.name || 'Usuario' }}
            </span>
            <span class="text-xs" :class="getSecondaryTextClasses()">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>

          <div v-if="message.audioUrl" class="flex items-start space-x-2">
            <button
              @click="handlePlayPause"
              class="w-8 h-8 p-0 rounded-lg transition-colors flex items-center justify-center"
              :class="getPlayButtonClasses()"
            >
              <Pause v-if="isPlaying" class="w-4 h-4" />
              <Play v-else class="w-4 h-4" />
            </button>

            <div class="flex-1">
              <!-- Audio Waveform as Progress Bar -->
              <div class="w-full h-8 rounded-lg overflow-hidden" :class="getProgressBarClasses()">
                <div class="h-full flex items-center space-x-[1px] p-1">
                  <div
                    v-for="(bar, index) in waveformBars"
                    :key="index"
                    class="flex-1 transition-all duration-100 rounded-[2px] m-[1px]"
                    :class="getWaveformBarClasses(index)"
                    :style="{
                      height: `${bar.height}%`,
                      opacity: index < currentBarIndex ? 1 : 0.6,
                    }"
                  />
                </div>
              </div>

              <!-- Time Display -->
              <div class="text-xs mt-1" :class="getSecondaryTextClasses()">
                <span v-if="isValidTime(currentTime)">
                  {{ formatDuration(currentTime) }}
                  <span v-if="isValidTime(audioDuration)">
                    / {{ formatDuration(audioDuration) }}</span
                  >
                </span>
                <span v-else :class="isOwn ? 'text-white/70' : 'text-gray-500'">
                  Cargando audio...
                </span>
              </div>
            </div>

            <!-- Playback Speed Control -->
            <div class="flex flex-col items-center space-y-1">
              <button
                @click="cyclePlaybackSpeed"
                class="w-6 h-6 p-0 rounded transition-colors flex items-center justify-center text-xs font-medium"
                :class="getSpeedButtonClasses()"
                :title="`Velocidad: ${currentPlaybackSpeed}x`"
              >
                {{ currentPlaybackSpeed }}x
              </button>
            </div>
          </div>

          <!-- Emoji Reactions -->
          <div>
            <EmojiReactions :message="message" />
          </div>
        </div>
      </div>
    </div>

    <audio
      v-if="message.audioUrl"
      :src="message.audioUrl"
      :ref="(el) => registerAudio(el as HTMLAudioElement)"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @loadedmetadata="handleLoadedMetadata"
      preload="metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

import { useVoiceChatStore } from '@/stores/voiceChat'
import { Play, Pause } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { VoiceMessage } from '@/types/voice-chat'
import EmojiReactions from './EmojiReactions.vue'

interface Props {
  message: VoiceMessage
  isOwn: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  play: [messageId: string]
  pause: []
}>()

const store = useVoiceChatStore()

const currentTime = ref(0)
const audioDuration = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentPlaybackSpeed = ref(1.0)

// Playback speed options
const playbackSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

// Waveform visualization
const waveformBars = ref(Array.from({ length: 20 }, () => ({ height: Math.random() * 60 + 20 })))

// Computed
const currentBarIndex = computed(() => {
  if (audioDuration.value <= 0 || !isFinite(audioDuration.value)) return 0
  if (currentTime.value <= 0 || !isFinite(currentTime.value)) return 0

  const progress = currentTime.value / audioDuration.value
  if (!isFinite(progress)) return 0

  return Math.floor(progress * waveformBars.value.length)
})

// Methods
const registerAudio = (el: HTMLAudioElement | null) => {
  audioElement.value = el
  if (el) {
    el.playbackRate = currentPlaybackSpeed.value
  }
}

const handleLoadedMetadata = () => {
  if (audioElement.value) {
    const duration = audioElement.value.duration

    // Set duration if valid, otherwise keep it at 0
    if (duration && isFinite(duration) && duration > 0) {
      audioDuration.value = duration
    }

    // Generate waveform
    generateWaveform()
  }
}

const generateWaveform = () => {
  // Generate static waveform bars for visual consistency
  waveformBars.value = Array.from({ length: 20 }, (_, index) => ({
    height: 30 + Math.sin(index * 0.3) * 20 + Math.random() * 10,
  }))
}

const cyclePlaybackSpeed = () => {
  const currentIndex = playbackSpeeds.indexOf(currentPlaybackSpeed.value)
  const nextIndex = (currentIndex + 1) % playbackSpeeds.length
  currentPlaybackSpeed.value = playbackSpeeds[nextIndex]

  if (audioElement.value) {
    audioElement.value.playbackRate = currentPlaybackSpeed.value
  }
}

// Audio validation utilities
const handlePlayPause = async () => {
  if (!props.message.audioUrl) return

  try {
    // Get the actual audio URL for playback
    const audioUrl = store.getAudioUrl(props.message.audioUrl)
    if (!audioUrl) {
      console.error('❌ Could not get audio URL for playback')
      toast.error('Error al cargar el audio')
      return
    }

    if (isPlaying.value) {
      // Stop playback
      if (audioElement.value) {
        audioElement.value.pause()
        audioElement.value.currentTime = 0
      }
      isPlaying.value = false
      store.stopPlaying()
    } else {
      // Start playback - simplified without validation
      if (audioElement.value) {
        audioElement.value.src = audioUrl
        audioElement.value.play()
        isPlaying.value = true
        store.activeMessageId = props.message.id
      }
    }
  } catch (error) {
    console.error('❌ Error handling audio playback:', error)
    toast.error('Error al reproducir el audio')
  }
}

const handleTimeUpdate = () => {
  if (audioElement.value) {
    const time = audioElement.value.currentTime
    // Simplified validation - just ensure it's a positive number
    if (time >= 0) {
      currentTime.value = time
    }
  }
}

const handleEnded = () => {
  emit('pause')
  currentTime.value = 0
  isPlaying.value = false
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60)
    if (diffInMinutes < 1) return 'Ahora'
    return `Hace ${diffInMinutes} min`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

const formatDuration = (time: number) => {
  // Simplified validation
  if (time < 0 || !isFinite(time)) {
    return '0:00'
  }

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Helper function to validate time values - simplified
const isValidTime = (time: number) => {
  return time >= 0 && isFinite(time)
}

// Styling methods
const getMessageClasses = () => {
  if (props.isOwn) {
    return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
  }
  return 'bg-white border border-gray-200'
}

const getTextClasses = () => {
  if (props.isOwn) {
    return 'text-white/90'
  }
  return 'text-gray-700'
}

const getSecondaryTextClasses = () => {
  if (props.isOwn) {
    return 'text-white/70'
  }
  return 'text-gray-500'
}

const getPlayButtonClasses = () => {
  if (props.isOwn) {
    return 'bg-white/20 hover:bg-white/30 text-white border-0'
  }
  return 'bg-primary text-white'
}

const getProgressBarClasses = () => {
  if (props.isOwn) {
    return 'bg-white/10'
  }
  return 'bg-gray-200'
}

const getWaveformBarClasses = (index: number) => {
  if (props.isOwn) {
    return index < currentBarIndex.value ? 'bg-white' : 'bg-white/60'
  }
  return index < currentBarIndex.value ? 'bg-primary' : 'bg-gray-400'
}

const getSpeedButtonClasses = () => {
  if (props.isOwn) {
    return 'bg-white/20 hover:bg-white/30 text-white border-0'
  }
  return 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-0'
}

// Lifecycle
onMounted(() => {
  if (audioElement.value) {
    audioElement.value.playbackRate = currentPlaybackSpeed.value
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
})

// Watch for playback speed changes from store
watch(
  () => store.playbackSpeed,
  (newSpeed) => {
    if (audioElement.value) {
      audioElement.value.playbackRate = newSpeed
      currentPlaybackSpeed.value = newSpeed
    }
  },
)
</script>
