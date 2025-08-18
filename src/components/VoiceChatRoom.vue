<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5]">
    <div class="container mx-auto px-4 py-6 h-full">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#967AFE] to-[#48D19C] flex items-center justify-center text-white font-bold"
          >
            LQ
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Chat de Voz - Práctica Oral</h1>
            <p class="text-gray-600 text-sm">
              Conectado como: <span class="font-medium text-[#967AFE]">{{ nickname }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
          >
            <Users class="w-3 h-3" />{{ uniqueUsers.length }} online
          </div>
          <button
            @click="logout"
            class="border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-3 py-1 text-sm flex items-center gap-2"
          >
            <LogOut class="w-4 h-4" />Salir
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        <div class="lg:col-span-3 flex flex-col">
          <div class="flex-1 flex flex-col bg-white/90 rounded-2xl shadow-xl">
            <div
              class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white rounded-t-2xl px-4 py-3 font-semibold"
            >
              Conversación Grupal
            </div>
            <div class="flex-1 flex flex-col p-0">
              <div class="flex-1 overflow-y-auto p-4 space-y-1" ref="scrollArea">
                <div v-if="messages.length === 0" class="text-center py-12">
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#967AFE]/20 to-[#48D19C]/20 rounded-full flex items-center justify-center"
                  >
                    <Users class="w-8 h-8 text-[#967AFE]" />
                  </div>
                  <h3 class="font-medium text-gray-700 mb-2">¡Inicia la conversación!</h3>
                  <p class="text-gray-500 text-sm">
                    Graba tu primer mensaje de voz para comenzar a practicar
                  </p>
                </div>
                <template v-else>
                  <VoiceMessageItem
                    v-for="m in messages"
                    :key="m.id"
                    :message="m"
                    :isOwn="m.user.name === nickname"
                  />
                </template>
                <div ref="messagesEnd" />
              </div>
              <div class="p-4 border-t border-gray-100">
                <VoiceRecorder />
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-4">
          <div class="bg-white/90 rounded-2xl shadow-lg p-4 text-center">
            <div
              class="w-12 h-12 mx-auto bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              {{ nickname[0]?.toUpperCase() }}
            </div>
            <h3 class="font-medium text-gray-900 mt-2">{{ nickname }}</h3>
            <p class="text-xs text-gray-500">{{ ownCount }} mensajes enviados</p>
          </div>

          <div class="bg-white/90 rounded-2xl shadow-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Settings class="w-4 h-4" />Controles de Audio
            </h4>
            <div class="flex gap-1">
              <button
                v-for="s in [1, 1.5, 2]"
                :key="s"
                @click="setSpeed(s as 1 | 1.5 | 2)"
                class="flex-1 text-xs rounded-lg px-2 py-1"
                :class="
                  playbackSpeed === s
                    ? 'bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white'
                    : 'border border-gray-200'
                "
              >
                {{ s }}x
              </button>
            </div>
          </div>

          <div class="bg-white/90 rounded-2xl shadow-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users class="w-4 h-4" />Participantes ({{ uniqueUsers.length }})
            </h4>
            <div class="space-y-2">
              <div v-for="u in shownUsers" :key="u" class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 bg-green-500 rounded-full" />
                <span :class="u === nickname ? 'font-medium text-[#967AFE]' : 'text-gray-600'">{{
                  u === nickname ? 'Tú' : u
                }}</span>
              </div>
              <p v-if="uniqueUsers.length > 5" class="text-xs text-gray-500">
                +{{ uniqueUsers.length - 5 }} más…
              </p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#967AFE]/10 to-[#48D19C]/10 rounded-2xl p-4">
            <h4 class="font-medium text-gray-900 mb-3">💡 Consejos de práctica</h4>
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
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Users, Settings, LogOut } from 'lucide-vue-next'
import VoiceRecorder from './VoiceRecorder.vue'
import VoiceMessageItem from './VoiceMessageItem.vue'
import { voiceChatActions, voiceChatState } from '../store/voiceChat'

const nickname = computed(() => voiceChatState.currentUser.nickname)
const messages = computed(() => voiceChatState.messages)
const playbackSpeed = computed(() => voiceChatState.playbackSpeed)
const ownCount = computed(() => messages.value.filter((m) => m.user.name === nickname.value).length)

const connectedUsers = ref<string[]>(['Ana García', 'Luis Martín', 'Carmen Silva'])
const uniqueUsers = computed(() =>
  Array.from(
    new Set([...connectedUsers.value, nickname.value, ...messages.value.map((m) => m.user.name)]),
  ),
)
const shownUsers = computed(() => uniqueUsers.value.slice(0, 5))

const setSpeed = (s: 1 | 1.5 | 2) => voiceChatActions.setPlaybackSpeed(s)
const logout = () => voiceChatActions.logout()

const messagesEnd = ref<HTMLDivElement | null>(null)
const scrollArea = ref<HTMLDivElement | null>(null)
const scrollBottom = () => messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
watch(messages, scrollBottom)

onMounted(() => {
  // Store already wires a BroadcastChannel and syncs messages across tabs.
  // We only ensure the UI scrolls to the latest message when mounted/updated.
  scrollBottom()
})
</script>
