<template>
  <div class="voice-chat-room">
    <!-- Room Header -->
    <div class="room-header">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ state.currentRoom?.name || 'Voice Chat' }}
      </h2>
      <div class="room-info">
        <span class="participants-count">
          {{ participantCount }}/{{ state.currentRoom?.max_participants || 10 }} participants
        </span>
        <span class="connection-status" :class="{ connected: state.isConnected }">
          {{ state.isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="state.error" class="error-message">
      <p class="text-red-600 bg-red-50 p-3 rounded-lg">{{ state.error }}</p>
    </div>

    <!-- Participants Grid -->
    <div class="participants-grid">
      <div
        v-for="participant in state.participants"
        :key="participant.id"
        class="participant-card"
        :class="{ speaking: participant.is_speaking }"
      >
        <div class="participant-avatar">
          <div class="avatar-circle">
            {{ participant.username.charAt(0).toUpperCase() }}
          </div>
          <div v-if="participant.is_speaking" class="speaking-indicator"></div>
        </div>
        <div class="participant-info">
          <span class="participant-name">{{ participant.username }}</span>
          <div class="audio-level-bar">
            <div
              class="audio-level-fill"
              :style="{ width: `${participant.audio_level * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Controls -->
    <div class="audio-controls">
      <div class="audio-status">
        <div class="microphone-status">
          <div class="mic-indicator" :class="{ active: state.isSpeaking }"></div>
          <span>{{ state.isSpeaking ? 'Speaking' : 'Silent' }}</span>
        </div>
        <div class="audio-level-display">
          <div class="level-bar">
            <div class="level-fill" :style="{ width: `${state.audioLevel * 100}%` }"></div>
          </div>
        </div>
      </div>

      <div class="control-buttons">
        <button
          v-if="!state.isConnected"
          @click="handleJoinRoom"
          class="btn btn-primary"
          :disabled="isRoomFull"
        >
          Join Room
        </button>
        <button v-else @click="handleLeaveRoom" class="btn btn-danger">Leave Room</button>
      </div>
    </div>

    <!-- Room Selection Modal -->
    <div v-if="showRoomModal" class="modal-overlay" @click="closeRoomModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Select or Create Room</h3>

        <div class="room-options">
          <div class="existing-rooms">
            <h4>Available Rooms</h4>
            <div class="room-list">
              <div
                v-for="room in availableRooms"
                :key="room.id"
                class="room-item"
                @click="selectRoom(room)"
              >
                <span class="room-name">{{ room.name }}</span>
                <span class="room-participants">{{ room.max_participants }} max</span>
              </div>
            </div>
          </div>

          <div class="create-room">
            <h4>Create New Room</h4>
            <form @submit.prevent="createNewRoom" class="create-form">
              <input
                v-model="newRoomName"
                type="text"
                placeholder="Room name"
                class="form-input"
                required
              />
              <input
                v-model="newRoomMaxParticipants"
                type="number"
                min="1"
                max="20"
                placeholder="Max participants"
                class="form-input"
                required
              />
              <button type="submit" class="btn btn-primary">Create Room</button>
            </form>
          </div>
        </div>

        <button @click="closeRoomModal" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVoiceChat } from '@/composables/useVoiceChat'
import type { Database } from '@/lib/supabase'

type VoiceChatRoom = Database['public']['Tables']['voice_chat_rooms']['Row']

console.log('🎬 VoiceChatRoom component script setup starting...')

console.log('🎬 About to import useVoiceChat composable...')

const { state, participantCount, isRoomFull, createRoom, joinRoom, leaveRoom, getAvailableRooms } =
  useVoiceChat()

console.log('🎬 Composable imported successfully')

console.log('🎬 VoiceChatRoom component composable loaded successfully')
console.log('📊 Initial state:', state.value)

// Modal state
const showRoomModal = ref(false)
const availableRooms = ref<VoiceChatRoom[]>([])
const newRoomName = ref('')
const newRoomMaxParticipants = ref(10)

// Methods
const handleJoinRoom = () => {
  showRoomModal.value = true
  loadAvailableRooms()
}

const handleLeaveRoom = async () => {
  await leaveRoom()
}

const closeRoomModal = () => {
  showRoomModal.value = false
  newRoomName.value = ''
  newRoomMaxParticipants.value = 10
}

const loadAvailableRooms = async () => {
  console.log('🔍 loadAvailableRooms called')
  try {
    availableRooms.value = await getAvailableRooms()
    console.log('✅ Available rooms loaded:', availableRooms.value.length)
  } catch (error) {
    console.error('❌ Error loading available rooms:', error)
  }
}

const selectRoom = async (room: VoiceChatRoom) => {
  const success = await joinRoom(room.id)
  if (success) {
    closeRoomModal()
  }
}

const createNewRoom = async () => {
  if (!newRoomName.value.trim()) return

  const roomId = await createRoom(newRoomName.value, newRoomMaxParticipants.value)
  if (roomId) {
    closeRoomModal()
  }
}

// Load available rooms on mount
onMounted(() => {
  console.log('🎬 VoiceChatRoom component mounted')
  console.log('🔍 Loading available rooms...')
  loadAvailableRooms()
  console.log('✅ VoiceChatRoom component setup complete')
})
</script>

<style scoped>
@reference '../styles/globals.css';

.voice-chat-room {
  @apply max-w-4xl mx-auto p-6 space-y-6;
}

.room-header {
  @apply flex justify-between items-center border-b border-gray-200 pb-4;
}

.room-info {
  @apply flex items-center space-x-4 text-sm text-gray-600;
}

.connection-status {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.connection-status.connected {
  @apply bg-green-100 text-green-800;
}

.connection-status:not(.connected) {
  @apply bg-gray-100 text-gray-800;
}

.error-message {
  @apply mt-4;
}

.participants-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.participant-card {
  @apply bg-white p-4 rounded-lg border border-gray-200 transition-all duration-200;
}

.participant-card.speaking {
  @apply border-blue-500 bg-blue-50 shadow-lg;
}

.participant-avatar {
  @apply relative flex justify-center mb-3;
}

.avatar-circle {
  @apply w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold;
}

.speaking-indicator {
  @apply absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse;
}

.participant-info {
  @apply text-center;
}

.participant-name {
  @apply text-sm font-medium text-gray-900 mb-2 block;
}

.audio-level-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.audio-level-fill {
  @apply h-full bg-blue-500 transition-all duration-150;
}

.audio-controls {
  @apply bg-white p-6 rounded-lg border border-gray-200 space-y-4;
}

.audio-status {
  @apply flex items-center justify-between;
}

.microphone-status {
  @apply flex items-center space-x-2;
}

.mic-indicator {
  @apply w-3 h-3 rounded-full bg-gray-400 transition-colors duration-200;
}

.mic-indicator.active {
  @apply bg-red-500;
}

.audio-level-display {
  @apply flex-1 max-w-xs mx-4;
}

.level-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.level-fill {
  @apply h-full bg-green-500 transition-all duration-150;
}

.control-buttons {
  @apply flex justify-center;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700;
}

/* Modal Styles */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto;
}

.modal-title {
  @apply text-xl font-bold text-gray-900 mb-4;
}

.room-options {
  @apply space-y-6 mb-6;
}

.room-list {
  @apply space-y-2;
}

.room-item {
  @apply p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200;
}

.room-name {
  @apply font-medium text-gray-900;
}

.room-participants {
  @apply text-sm text-gray-600 ml-2;
}

.create-form {
  @apply space-y-3;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
