<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden"
  >
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
    </div>

    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <!-- LingoQuesto Logo Placeholder -->
              <div
                class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-2xl font-bold">LQ</span>
              </div>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">¿Olvidaste tu contraseña?</h1>
          <p class="text-gray-600">No te preocupes, te ayudaremos a recuperarla</p>
        </div>

        <!-- Forgot Password Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <form @submit.prevent="handleForgotPassword" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="tu@email.com"
                :disabled="loading"
              />
            </div>

            <!-- Success Message -->
            <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-sm text-green-600">{{ success }}</p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </span>
              <span v-else>Enviar Instrucciones</span>
            </button>
          </form>

          <!-- Back to Login -->
          <div class="text-center mt-6">
            <p class="text-gray-600">
              ¿Recordaste tu contraseña?
              <router-link
                to="/auth/login"
                class="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Inicia sesión aquí
              </router-link>
            </p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link
            to="/welcome"
            class="text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>Volver al inicio</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
})

// UI state
const loading = ref(false)
const error = ref('')
const success = ref('')

// Handle form submission
const handleForgotPassword = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const result = await authStore.resetPassword(form.email)

    if (result.success) {
      success.value = 'Se han enviado las instrucciones de recuperación a tu correo electrónico'
      toast.success('Instrucciones enviadas')
    } else {
      error.value = result.error || 'Error al enviar las instrucciones'
    }
  } catch (err) {
    error.value = 'Error inesperado al enviar las instrucciones'
    console.error('Forgot password error:', err)
  } finally {
    loading.value = false
  }
}

// Watch form changes to clear errors
onMounted(() => {
  // Clear any existing errors
  authStore.clearError()
})
</script>
