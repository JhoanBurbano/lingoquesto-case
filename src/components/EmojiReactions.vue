<template>
  <div class="flex items-center space-x-2 relative">
    <!-- Emoji Reactions Display -->
    <div v-if="message.reactions.length > 0" class="flex items-center space-x-1">
      <div
        v-for="(reaction, index) in groupedReactions"
        :key="`${reaction.emoji}-${index}`"
        class="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
        :class="{ 'bg-blue-100': hasUserReacted(reaction.emoji) }"
      >
        <img :src="getEmojiPath(reaction.emoji)" :alt="reaction.emoji" class="w-4 h-4" />
        <span class="text-gray-600">{{ reaction.count }}</span>
      </div>
    </div>

    <!-- Add Reaction Button -->
    <button
      @click="showEmojiPicker = !showEmojiPicker"
      class="p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Plus class="w-4 h-4 text-gray-400" />
    </button>

    <!-- Emoji Picker -->
    <div
      v-if="showEmojiPicker"
      class="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50"
    >
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="emoji in availableEmojis"
          :key="emoji"
          @click="addReaction(emoji)"
          class="w-8 h-8 p-1 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          :class="{ 'bg-blue-100': hasUserReacted(emoji) }"
        >
          <img :src="getEmojiPath(emoji)" :alt="emoji" class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useVoiceChatStore } from '@/stores/voiceChat'
import type { VoiceMessage } from '@/types/voice-chat'

interface Props {
  message: VoiceMessage
}

const props = defineProps<Props>()
const store = useVoiceChatStore()
const showEmojiPicker = ref(false)

const availableEmojis = ['celebrate', 'cool', 'exited', 'funny', 'sad']

// Group reactions by emoji and count them
const groupedReactions = computed(() => {
  const groups = new Map<string, { emoji: string; count: number; users: string[] }>()

  props.message.reactions.forEach((reaction) => {
    if (!groups.has(reaction.emoji)) {
      groups.set(reaction.emoji, { emoji: reaction.emoji, count: 0, users: [] })
    }
    const group = groups.get(reaction.emoji)!
    group.count++
    group.users.push(reaction.userId)
  })

  return Array.from(groups.values())
})

const getEmojiPath = (emoji: string) => {
  return `/assets/${emoji}_emoji.svg`
}

const hasUserReacted = (emoji: string) => {
  return props.message.reactions.some((r) => r.emoji === emoji && r.userId === store.user?.id)
}

const addReaction = (emoji: string) => {
  if (hasUserReacted(emoji)) {
    store.removeReaction(props.message.id, emoji, store.user?.id || '')
  } else {
    store.addReaction(props.message.id, emoji)
  }
  showEmojiPicker.value = false
}

// Close picker when clicking outside
const closeOnClickOutside = (event: Event) => {
  if (!(event.target as Element).closest('.relative')) {
    showEmojiPicker.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>
