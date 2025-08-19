<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

import { useVoiceChatStore } from '@/stores/voiceChat'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { Mic2, Users, LogOut } from 'lucide-vue-next'
import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import LingoLogo from '@/components/atoms/LingoLogo.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import VoiceMessageItem from '@/components/VoiceMessageItem.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'

defineOptions({ name: 'OralPracticeView' })

const store = useVoiceChatStore()
const authStore = useAuthStore()

// Room management
const showRoomModal = ref(false)
const newRoomName = ref('')
const newRoomMaxParticipants = ref(10)

// Computed
const userMessageCount = computed(() => {
  return store.messages.filter((m) => m.user?.id === store.user?.id).length
})

const isUserAuthenticated = computed(() => {
  return authStore.isAuthenticated && store.user
})

// Methods
const initializeVoiceChat = () => {
  if (authStore.isAuthenticated && authStore.profile) {
    store.initializeFromAuth()
    console.log('✅ Voice chat initialized with authenticated user')
  }
}

// Auto-scroll to latest message
const scrollToBottom = () => {
  nextTick(() => {
    const messagesArea = document.querySelector('.messages-area')
    if (messagesArea) {
      messagesArea.scrollTop = messagesArea.scrollHeight
    }
  })
}

// Watch for new messages to auto-scroll
watch(
  () => store.messages.length,
  () => {
    if (store.messages.length > 0) {
      scrollToBottom()
    }
  },
)

const onPlayMessage = (messageId: string) => {
  store.startPlaying(messageId)
}

const onPauseMessage = () => {
  store.stopPlaying()
}

const onMessageSent = () => {
  toast.success('¡Mensaje enviado! 🎤')
  // Auto-scroll after sending message
  scrollToBottom()
}

// Room management methods
const handleLeaveRoom = async () => {
  await store.leaveRoom()
  toast.success('Sala abandonada correctamente')
}

const handleJoinRoom = async (roomId: string) => {
  const success = await store.joinRoom(roomId)
  if (success) {
    showRoomModal.value = false
    toast.success('Te has unido a la sala correctamente')
  } else {
    toast.error('Error al unirse a la sala')
  }
}

const handleCreateRoom = async () => {
  if (!newRoomName.value.trim()) return

  const roomId = await store.createRoom(newRoomName.value, newRoomMaxParticipants.value)
  if (roomId) {
    showRoomModal.value = false
    newRoomName.value = ''
    newRoomMaxParticipants.value = 10
    toast.success('Sala creada correctamente')
  } else {
    toast.error('Error al crear la sala')
  }
}

const loadAvailableRooms = async () => {
  await store.getAvailableRooms()
}

// Initialize store
onMounted(() => {
  initializeVoiceChat()
  loadAvailableRooms()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5] relative overflow-hidden">
    <!-- Login Screen -->
    <div v-if="!isUserAuthenticated" class="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full">
      <DecorativePattern class="top-0 right-0 w-96 h-48" />

      <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div class="max-w-md w-full">
          <div class="mb-8">
            <div class="flex justify-center mb-6">
              <LingoCharacter variant="teaching" size="lg" :animated="true" />
            </div>
            <h2
              class="text-xl font-['Satoshi',sans-serif] bg-gradient-to-r from-[#967AFE] via-[#48D19C] to-[#FFAF54] bg-clip-text text-transparent"
            >
              Únete al Chat de Voz
            </h2>
            <p class="text-gray-600 mt-2">
              Practica tu pronunciación y fluidez con mensajes de voz en tiempo real
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-white text-xl font-bold">🔒</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Autenticación Requerida</h3>
              <p class="text-gray-600 mb-6">
                Para acceder al chat de voz, necesitas iniciar sesión en tu cuenta de LingoQuesto.
              </p>
              <router-link
                to="/auth/login"
                class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Mic2 class="w-4 h-4 mr-2" />
                Iniciar Sesión
              </router-link>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-xs text-gray-500">
              ¿No tienes cuenta?
              <router-link
                to="/auth/register"
                class="text-purple-600 hover:text-purple-700 underline"
              >
                Regístrate aquí
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Room -->
    <div v-else class="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full">
      <DecorativePattern class="top-0 right-0 w-96 h-48" />

      <!-- Header -->
      <div class="flex items-center justify-between mb-6 sm:mb-8">
        <div class="flex items-center gap-3 sm:gap-4">
          <LingoLogo class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          <div>
            <h1
              class="font-['Satoshi',sans-serif] text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900"
            >
              Chat de Voz - Práctica Oral
            </h1>
            <p class="text-gray-600 text-xs sm:text-sm lg:text-base">
              Conectado como:
              <span class="font-medium text-[#967AFE]">{{ store.user?.name || 'Usuario' }}</span>
              <span v-if="store.currentRoom" class="ml-2">
                • Sala: <span class="font-medium text-[#48D19C]">{{ store.currentRoom.name }}</span>
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Badge
            class="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
          >
            <Users class="w-3 h-3 mr-1" />
            {{ store.participants.length }} online
          </Badge>

          <Button
            v-if="!store.currentRoom"
            variant="outline"
            size="sm"
            @click="
              () => {
                showRoomModal = true
                loadAvailableRooms()
              }
            "
            class="border-[#48D19C] text-[#48D19C] hover:bg-[#48D19C]/10 rounded-xl z-10"
          >
            <Users class="w-4 h-4 mr-2" />
            Unirse a Sala
          </Button>

          <Button
            v-else
            variant="outline"
            size="sm"
            @click="handleLeaveRoom"
            class="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl z-10"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Salir de Sala
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6" style="height: calc(100vh - 200px)">
        <!-- Chat Messages - Main Area -->
        <div class="lg:col-span-3 flex flex-col min-h-0">
          <div
            class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 flex flex-col h-full"
          >
            <!-- Header del Chat -->
            <div
              class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white rounded-t-2xl p-4 flex-shrink-0"
            >
              <h3 class="font-['Satoshi',sans-serif] flex items-center gap-3 text-lg font-semibold">
                <LingoCharacter variant="teaching" class="w-6 h-6" />
                Conversación Grupal
              </h3>
            </div>

            <!-- Contenido del Chat -->
            <div class="flex-1 flex flex-col min-h-0">
              <!-- Messages Area - Scrollable -->
              <div
                class="flex-1 overflow-y-auto p-4 min-h-0 messages-area"
                style="max-height: calc(100vh - 350px)"
              >
                <div v-if="!store.currentRoom" class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#967AFE]/20 to-[#48D19C]/20 rounded-full flex items-center justify-center"
                  >
                    <Users class="w-8 h-8 text-[#967AFE]" />
                  </div>
                  <h3 class="font-['Satoshi',sans-serif] font-medium text-gray-700 mb-2">
                    ¡Únete a una sala para comenzar!
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Selecciona una sala existente o crea una nueva para practicar conversación
                  </p>
                  <button
                    @click="
                      () => {
                        showRoomModal = true
                        loadAvailableRooms()
                      }
                    "
                    class="mt-4 bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Ver Salas Disponibles
                  </button>
                </div>

                <div v-else-if="store.messages.length === 0" class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#967AFE]/20 to-[#48D19C]/20 rounded-full flex items-center justify-center"
                  >
                    <Mic2 class="w-8 h-8 text-[#967AFE]" />
                  </div>
                  <h3 class="font-['Satoshi',sans-serif] font-medium text-gray-700 mb-2">
                    ¡Inicia la conversación!
                  </h3>
                  <p class="text-gray-500 text-sm">
                    Graba tu primer mensaje de voz para comenzar a practicar
                  </p>
                </div>

                <div v-else class="space-y-4">
                  <VoiceMessageItem
                    v-for="message in store.messages"
                    :key="message.id"
                    :message="message"
                    :is-own="message.user.id === store.user?.id"
                    @play="onPlayMessage"
                    @pause="onPauseMessage"
                  />
                </div>
              </div>

              <!-- Voice Recorder - Fixed at bottom -->
              <div
                v-if="store.currentRoom"
                class="voice-recorder-fixed border-t border-gray-100 p-4 flex-shrink-0 bg-white/50 rounded-b-2xl"
              >
                <VoiceRecorder @message-sent="onMessageSent" :disabled="!store.currentRoom" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Participants and Stats -->
        <div class="lg:col-span-1">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6">
            <div class="mb-6">
              <h3 class="font-['Satoshi',sans-serif] font-semibold text-gray-900 mb-3">
                Participantes ({{ store.participants.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="participant in store.participants.slice(0, 5)"
                  :key="participant.id"
                  class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center"
                  >
                    <span class="text-white text-sm font-bold">{{
                      participant.name.charAt(0).toUpperCase()
                    }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ participant.name }}</span>
                </div>
                <p v-if="store.participants.length > 5" class="text-xs text-gray-500">
                  +{{ store.participants.length - 5 }} más...
                </p>
              </div>
            </div>

            <div class="border-t pt-6">
              <h3 class="font-['Satoshi',sans-serif] font-semibold text-gray-900 mb-3">
                Estadísticas
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between mb-4">
                  <span class="text-sm text-gray-600">Mensajes enviados:</span>
                  <span class="text-sm font-medium text-gray-900">{{ userMessageCount }}</span>
                </div>
              </div>
            </div>

            <div class="border-t pt-6">
              <h3 class="font-['Satoshi',sans-serif] font-semibold text-gray-900 mb-3">Consejos</h3>
              <ul class="text-xs text-gray-600 space-y-2">
                <li>• Habla claro y con confianza</li>
                <li>• Practica la pronunciación</li>
                <li>• Escucha otros mensajes</li>
                <li>• Varía la velocidad de reproducción</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Selection Modal -->
      <div
        v-if="showRoomModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Seleccionar o Crear Sala</h3>
            <p class="text-gray-600">Únete a una sala existente o crea una nueva</p>
          </div>

          <!-- Available Rooms -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-900 mb-3">Salas Disponibles</h4>
            <div
              v-if="store.availableRooms.length === 0"
              class="text-gray-500 text-sm py-4 text-center"
            >
              No hay salas disponibles
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="room in store.availableRooms"
                :key="room.id"
                @click="handleJoinRoom(room.id)"
                class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900">{{ room.name }}</span>
                  <span class="text-sm text-gray-500">{{ room.max_participants }} max</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Create New Room -->
          <div class="border-t pt-6">
            <h4 class="font-medium text-gray-900 mb-3">Crear Nueva Sala</h4>
            <form @submit.prevent="handleCreateRoom" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Sala
                </label>
                <input
                  v-model="newRoomName"
                  type="text"
                  placeholder="Ej: Conversación Básica"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Máximo Participantes
                </label>
                <select
                  v-model="newRoomMaxParticipants"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
                >
                  <option value="5">5 participantes</option>
                  <option value="10">10 participantes</option>
                  <option value="15">15 participantes</option>
                  <option value="20">20 participantes</option>
                </select>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Crear Sala
                </button>
                <button
                  type="button"
                  @click="showRoomModal = false"
                  class="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos personalizados para el scroll del chat */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #967afe #f3f4f6;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #967afe, #48d19c);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #059669);
}

/* Animación suave para el scroll */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Estilos para el área de mensajes */
.messages-area {
  min-height: 200px;
}

/* Estilos para el recorder fijo */
.voice-recorder-fixed {
  position: sticky;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e5e7eb;
  z-index: 10;
}
</style>
