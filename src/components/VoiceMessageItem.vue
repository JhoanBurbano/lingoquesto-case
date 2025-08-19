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

          <div v-if="message.audioUrl" class="flex items-center space-x-2">
            <button
              @click="handlePlayPause"
              class="w-8 h-8 p-0 rounded-lg transition-colors flex items-center justify-center"
              :class="getPlayButtonClasses()"
            >
              <Pause v-if="isPlaying" class="w-4 h-4" />
              <Play v-else class="w-4 h-4" />
            </button>

            <div class="flex-1">
              <div class="w-full h-1 rounded-full overflow-hidden" :class="getProgressBarClasses()">
                <div
                  class="h-full transition-all duration-100"
                  :class="getProgressFillClasses()"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <div class="text-xs mt-1" :class="getSecondaryTextClasses()">
                {{ formatDuration(currentTime) }} / {{ formatDuration(audioDuration) }}
              </div>
            </div>

            <button
              @click="handleRestart"
              class="w-6 h-6 p-0 rounded transition-colors flex items-center justify-center"
              :class="getRestartButtonClasses()"
            >
              <RotateCcw class="w-3 h-3" />
            </button>
          </div>

          <!-- Emoji Reactions -->
          <div class="pt-2">
            <EmojiReactions :message="message" />
          </div>

          <div v-if="message.audioUrl" class="flex items-center justify-between">
            <span class="text-xs" :class="getSecondaryTextClasses()">
              Velocidad: {{ store.playbackSpeed }}x
            </span>
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
      preload="metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

import { useVoiceChatStore } from '@/stores/voiceChat'
import { Play, Pause, RotateCcw } from 'lucide-vue-next'
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

// Computed
const progress = computed(() => {
  if (audioDuration.value <= 0) return 0
  return (currentTime.value / audioDuration.value) * 100
})

// Methods
const registerAudio = (el: HTMLAudioElement | null) => {
  audioElement.value = el
  if (el) {
    el.playbackRate = store.playbackSpeed
  }
}

const handlePlayPause = async () => {
  if (!props.message.audioUrl) return

  try {
    // Get the actual audio URL for playback
    const audioUrl = store.getAudioUrl(props.message.audioUrl)
    if (!audioUrl) {
      console.error('❌ Could not get audio URL for playback')
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
      // Start playback
      if (audioElement.value) {
        audioElement.value.src = audioUrl
        audioElement.value.play()
        isPlaying.value = true
        store.activeMessageId = props.message.id
      }
    }
  } catch (error) {
    console.error('❌ Error handling audio playback:', error)
  }
}

const handleTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const handleEnded = () => {
  emit('pause')
  currentTime.value = 0
}

const handleRestart = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = 0
    currentTime.value = 0
    if (props.message.isPlaying) {
      audioElement.value.play()
    }
  }
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
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
    return 'bg-white/30'
  }
  return 'bg-gray-200'
}

const getProgressFillClasses = () => {
  if (props.isOwn) {
    return 'bg-white'
  }
  return 'bg-primary'
}

const getRestartButtonClasses = () => {
  if (props.isOwn) {
    return 'text-white/70 hover:text-white hover:bg-white/20'
  }
  return 'text-gray-500 hover:text-gray-700'
}

// Lifecycle
onMounted(() => {
  if (audioElement.value) {
    audioElement.value.playbackRate = store.playbackSpeed
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
})

// Watch for playback speed changes
watch(
  () => store.playbackSpeed,
  (newSpeed) => {
    if (audioElement.value) {
      audioElement.value.playbackRate = newSpeed
    }
  },
)
</script>
