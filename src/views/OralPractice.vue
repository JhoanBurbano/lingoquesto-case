<script setup lang="ts">
import { ref, computed } from 'vue'

import { useVoiceChatStore } from '@/stores/voiceChat'
import { toast } from 'vue-sonner'
import { Mic2, Users, LogOut, Settings } from 'lucide-vue-next'
import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import LingoLogo from '@/components/atoms/LingoLogo.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import VoiceMessageItem from '@/components/VoiceMessageItem.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'

defineOptions({ name: 'OralPracticeView' })

const store = useVoiceChatStore()

// Login state
const nickname = ref('')
const nicknameError = ref('')
const isLoggingIn = ref(false)

// Computed
const connectedUsers = computed(() => {
  const users = new Map()
  store.messages.forEach((msg) => {
    if (msg.user) {
      users.set(msg.user.id, msg.user)
    }
  })
  // Add current user if not in messages
  if (store.user) {
    users.set(store.user.id, store.user)
  }
  return Array.from(users.values())
})

const userMessageCount = computed(() => {
  return store.messages.filter((m) => m.user?.id === store.user?.id).length
})

// Methods
const handleLogin = async () => {
  nicknameError.value = ''

  if (nickname.value.trim().length < 2) {
    nicknameError.value = 'El nickname debe tener al menos 2 caracteres'
    return
  }

  if (nickname.value.trim().length > 20) {
    nicknameError.value = 'El nickname debe tener menos de 20 caracteres'
    return
  }

  isLoggingIn.value = true

  try {
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    store.login({
      id: `user_${Date.now()}`,
      name: nickname.value.trim(),
      role: 'student',
    })

    toast.success(`¡Bienvenido ${nickname.value.trim()}! 🎤`)
  } catch {
    toast.error('Error al conectar')
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = () => {
  store.logout()
  nickname.value = ''
  toast.success('Sesión cerrada correctamente')
}

const onPlayMessage = (messageId: string) => {
  store.startPlaying(messageId)
}

const onPauseMessage = () => {
  store.stopPlaying()
}

const onMessageSent = () => {
  toast.success('¡Mensaje enviado! 🎤')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5] relative overflow-hidden">
    <!-- Login Screen -->
    <div v-if="!store.user" class="container mx-auto px-4 sm:px-6 py-6 sm:py-8 h-full">
      <DecorativePattern class="top-0 right-0 w-96 h-48" />

      <!-- Header -->
      <div class="flex items-center justify-between mb-6 sm:mb-8">
        <div class="flex items-center gap-3 sm:gap-4">
          <LingoLogo class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          <div>
            <h1
              class="font-['Satoshi',sans-serif] text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900"
            >
              Práctica Oral
            </h1>
            <p class="text-gray-600 text-xs sm:text-sm lg:text-base">
              Chat de voz para practicar conversación
            </p>
          </div>
        </div>

        <LingoCharacter variant="happy" class="w-8 h-8 sm:w-10 sm:h-10" :animated="true" />
      </div>

      <!-- Login Form -->
      <div class="flex items-center justify-center h-[calc(100vh-200px)]">
        <div class="w-full max-w-md">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center"
              >
                <Mic2 class="w-8 h-8 text-white" />
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

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label for="nickname" class="block text-sm font-medium text-gray-700 mb-2">
                  Tu nombre o nickname
                </label>
                <input
                  id="nickname"
                  v-model="nickname"
                  type="text"
                  placeholder="Ej: Ana, Carlos, Profe..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE] transition-colors"
                  :class="{
                    'border-red-300 focus:border-red-500 focus:ring-red-500/20': nicknameError,
                  }"
                />
                <p v-if="nicknameError" class="text-red-500 text-sm mt-1">{{ nicknameError }}</p>
              </div>

              <button
                type="submit"
                :disabled="!nickname.trim() || isLoggingIn"
                class="w-full bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div v-if="isLoggingIn" class="flex items-center justify-center gap-2">
                  <div
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                  Conectando...
                </div>
                <div v-else class="flex items-center justify-center gap-2">
                  <Mic2 class="w-4 h-4" />
                  Entrar al Chat
                </div>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">
                Al unirte, podrás grabar y compartir mensajes de voz con otros participantes
              </p>
            </div>
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
              Conectado como: <span class="font-medium text-[#967AFE]">{{ store.user.name }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <Badge
            class="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
          >
            <Users class="w-3 h-3 mr-1" />
            {{ connectedUsers.length }} online
          </Badge>

          <LingoCharacter variant="teaching" class="w-8 h-8 sm:w-10 sm:h-10" :animated="true" />

          <Button
            variant="outline"
            size="sm"
            @click="handleLogout"
            class="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <!-- Chat Messages - Main Area -->
        <div class="lg:col-span-3 flex flex-col">
          <div
            class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 flex-1 flex flex-col"
          >
            <div class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white rounded-t-2xl p-4">
              <h3 class="font-['Satoshi',sans-serif] flex items-center gap-3 text-lg font-semibold">
                <LingoCharacter variant="teaching" class="w-6 h-6" />
                Conversación Grupal
              </h3>
            </div>

            <div class="flex-1 flex flex-col p-0">
              <!-- Messages Area -->
              <div class="flex-1 p-4 overflow-y-auto">
                <div v-if="store.messages.length === 0" class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#967AFE]/20 to-[#48D19C]/20 rounded-full flex items-center justify-center"
                  >
                    <Users class="w-8 h-8 text-[#967AFE]" />
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

              <!-- Voice Recorder -->
              <div class="p-4 border-t border-gray-100">
                <VoiceRecorder @message-sent="onMessageSent" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Controls and Info -->
        <div class="lg:col-span-1 space-y-4">
          <!-- User Info -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 p-4">
            <div class="text-center space-y-3">
              <div
                class="w-12 h-12 mx-auto bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center"
              >
                <span class="font-['Satoshi',sans-serif] font-bold text-white text-lg">
                  {{ store.user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h3 class="font-['Satoshi',sans-serif] font-medium text-gray-900">
                  {{ store.user.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ userMessageCount }} mensajes enviados</p>
              </div>
            </div>
          </div>

          <!-- Voice Controls -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 p-4">
            <h4
              class="font-['Satoshi',sans-serif] font-medium text-gray-900 mb-3 flex items-center gap-2"
            >
              <Settings class="w-4 h-4" />
              Controles de Audio
            </h4>

            <div class="space-y-3">
              <div>
                <label class="text-sm text-gray-600 block mb-2"> Velocidad de reproducción </label>
                <div class="flex gap-1">
                  <button
                    v-for="speed in [1, 1.5, 2]"
                    :key="speed"
                    @click="store.setPlaybackSpeed(speed)"
                    class="flex-1 py-2 px-3 text-xs rounded-lg transition-colors"
                    :class="
                      store.playbackSpeed === speed
                        ? 'bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    "
                  >
                    {{ speed }}x
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Connected Users -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0 p-4">
            <h4
              class="font-['Satoshi',sans-serif] font-medium text-gray-900 mb-3 flex items-center gap-2"
            >
              <Users class="w-4 h-4" />
              Participantes ({{ connectedUsers.length }})
            </h4>

            <div class="space-y-2">
              <div
                v-for="user in connectedUsers.slice(0, 5)"
                :key="user.id"
                class="flex items-center gap-2 text-sm"
              >
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span
                  :class="
                    user.id === store.user?.id ? 'font-medium text-[#967AFE]' : 'text-gray-600'
                  "
                >
                  {{ user.id === store.user?.id ? 'Tú' : user.name }}
                </span>
              </div>
              <p v-if="connectedUsers.length > 5" class="text-xs text-gray-500">
                +{{ connectedUsers.length - 5 }} más...
              </p>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-gradient-to-br from-[#967AFE]/10 to-[#48D19C]/10 rounded-2xl p-4">
            <h4 class="font-['Satoshi',sans-serif] font-medium text-gray-900 mb-3">
              💡 Consejos de práctica
            </h4>
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
  </div>
</template>
