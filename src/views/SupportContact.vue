<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
    <!-- Decorative Background Shapes -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Green Zig-zags -->
      <div
        class="absolute top-20 left-10 w-8 h-8 bg-green-400 transform rotate-45 opacity-20"
      ></div>
      <div
        class="absolute top-32 left-20 w-6 h-6 bg-green-300 transform -rotate-12 opacity-30"
      ></div>

      <!-- Yellow Rectangles -->
      <div
        class="absolute top-16 right-20 w-10 h-6 bg-yellow-400 transform rotate-15 opacity-25"
      ></div>
      <div
        class="absolute top-40 right-32 w-8 h-4 bg-yellow-300 transform -rotate-45 opacity-20"
      ></div>

      <!-- Light Blue Rectangles -->
      <div
        class="absolute top-24 left-1/4 w-6 h-8 bg-blue-300 transform rotate-30 opacity-20"
      ></div>
      <div
        class="absolute top-48 left-1/3 w-4 h-6 bg-blue-200 transform -rotate-15 opacity-25"
      ></div>

      <!-- Purple Crescents -->
      <div class="absolute top-28 right-1/4 w-8 h-8 bg-purple-400 rounded-full opacity-15"></div>
      <div class="absolute top-36 right-1/3 w-6 h-6 bg-purple-300 rounded-full opacity-20"></div>

      <!-- Orange Rectangles -->
      <div
        class="absolute top-20 left-1/2 w-8 h-5 bg-orange-400 transform rotate-60 opacity-20"
      ></div>
      <div
        class="absolute top-44 left-2/3 w-6 h-7 bg-orange-300 transform -rotate-30 opacity-25"
      ></div>

      <!-- Various Colored Circles -->
      <div class="absolute top-16 left-16 w-4 h-4 bg-green-300 rounded-full opacity-30"></div>
      <div class="absolute top-36 left-24 w-3 h-3 bg-purple-300 rounded-full opacity-25"></div>
      <div class="absolute top-52 left-20 w-5 h-5 bg-orange-300 rounded-full opacity-20"></div>
      <div class="absolute top-28 left-40 w-4 h-4 bg-blue-300 rounded-full opacity-25"></div>

      <!-- Purple X Shape -->
      <div
        class="absolute top-24 right-16 w-6 h-6 bg-purple-400 transform rotate-45 opacity-20"
      ></div>
      <div
        class="absolute top-24 right-16 w-6 h-6 bg-purple-400 transform -rotate-45 opacity-20"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <!-- Lingosto Character -->
        <div class="flex justify-center mb-4">
          <div class="relative">
            <LingoCharacter variant="teaching" size="lg" :animated="true" />
          </div>
        </div>

        <!-- Greeting -->
        <h1 class="text-4xl font-sat-bold text-gray-800 mb-2">Hola, {{ userName }}!</h1>

        <!-- Main Question -->
        <h2 class="text-2xl font-sat-semibold text-gray-800">¿Cómo podemos ayudarte hoy?</h2>
      </div>

      <!-- Main Input Area -->
      <div class="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
        <textarea
          v-model="supportMessage"
          placeholder="Describe tu problema o pregunta aquí... Por ejemplo: tengo problemas con el chat de voz o no puedo acceder al panel del profesor..."
          class="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400"
        ></textarea>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4 mt-4">
          <button
            class="px-6 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              ></path>
            </svg>
            <span>Adjuntar archivo</span>
          </button>

          <button
            @click="submitSupportRequest"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Enviar mensaje</span>
          </button>
        </div>
      </div>

      <!-- Examples Section -->
      <div class="text-center mb-8">
        <h3 class="text-2xl font-sat-bold text-gray-800 mb-6">Ejemplos frecuentes</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Example Card 1 -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="h-2 bg-gradient-to-r from-purple-500 to-green-400"></div>
            <div class="p-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-purple-100 to-green-100 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h4 class="font-sat-semibold text-gray-800 mb-3">Problemas con el chat de voz</h4>
              <button
                @click="useExample('voice-chat')"
                class="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-green-400 text-white rounded-lg hover:from-purple-600 hover:to-green-500 transition-all flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span>Use this one</span>
              </button>
            </div>
          </div>

          <!-- Example Card 2 -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="h-2 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
            <div class="p-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h4 class="font-sat-semibold text-gray-800 mb-3">Learning Content</h4>
              <button
                @click="useExample('learning-content')"
                class="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span>Use this one</span>
              </button>
            </div>
          </div>

          <!-- Example Card 3 -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div class="p-6">
              <div
                class="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h4 class="font-sat-semibold text-gray-800 mb-3">Account & Access</h4>
              <button
                @click="useExample('account-access')"
                class="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span>Use this one</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Support Options -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-sat-semibold text-gray-800 mb-4 text-center">
          Otras formas de obtener ayuda
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-gray-700">Revisa nuestras Preguntas Frecuentes</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span class="text-gray-700">Escríbenos por correo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVoiceChatStore } from '@/stores/voiceChat'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'

const store = useVoiceChatStore()
const supportMessage = ref('')

// Get personalized user name
const userName = computed(() => {
  return store.user?.name || 'LingoQuesto'
})

// Example templates
const exampleTemplates = {
  'voice-chat':
    '¡Hola! Estoy teniendo problemas con el chat de voz. La grabación no funciona correctamente y no puedo enviar mensajes de voz a mis estudiantes. ¿Pueden ayudarme a solucionarlo?',
  'learning-content':
    '¡Hola! Me gustaría saber más sobre cómo crear contenido de aprendizaje personalizado para mis estudiantes. ¿Cómo puedo agregar nuevos ejercicios o modificar los existentes?',
  'account-access':
    '¡Hola! Tengo problemas para acceder a mi panel de profesor. Sigo recibiendo un mensaje de error al iniciar sesión. ¿Pueden ayudarme con esto?',
}

const useExample = (templateKey: keyof typeof exampleTemplates) => {
  supportMessage.value = exampleTemplates[templateKey]
}

const submitSupportRequest = () => {
  if (!supportMessage.value.trim()) {
    alert('Por favor ingresa un mensaje antes de enviar.')
    return
  }

  // En un entorno real, aquí enviarías la solicitud al backend
  if (import.meta.env?.MODE !== 'production') {
    console.log('Support request submitted:', {
      user: store.user,
      message: supportMessage.value,
      timestamp: new Date().toISOString(),
    })
  }

  // Mensaje de éxito
  alert(
    '¡Gracias! Tu solicitud de soporte ha sido enviada. Te responderemos en las próximas 24 horas.',
  )

  // Limpiar el mensaje
  supportMessage.value = ''
}
</script>
