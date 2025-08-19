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
      <div class="w-full max-w-md text-center">
        <!-- Logo and Title -->
        <div class="mb-8">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <!-- LingoQuesto Logo Placeholder -->
              <div
                class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
              >
                <span class="text-white text-2xl font-bold">LQ</span>
              </div>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Autenticando...</h1>
          <p class="text-gray-600">Completando tu inicio de sesión</p>
        </div>

        <!-- Loading Animation -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">{{ statusMessage }}</p>

          <!-- Error Display -->
          <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-sm text-red-600">{{ error }}</p>
            <button
              @click="retryAuth"
              class="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Reintentar
            </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

// UI state
const statusMessage = ref('Procesando autenticación...')
const error = ref('')

// Handle OAuth callback
const handleAuthCallback = async () => {
  try {
    statusMessage.value = 'Verificando sesión...'

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (session) {
      statusMessage.value = 'Iniciando sesión...'

      // Update auth store
      await authStore.initializeAuth()

      statusMessage.value = '¡Bienvenido! Redirigiendo...'
      toast.success('¡Inicio de sesión exitoso!')

      // Redirect to dashboard or intended page
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      throw new Error('No se pudo obtener la sesión')
    }
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = err instanceof Error ? err.message : 'Error durante la autenticación'
    statusMessage.value = 'Error en la autenticación'
  }
}

// Retry authentication
const retryAuth = () => {
  error.value = ''
  statusMessage.value = 'Reintentando autenticación...'
  handleAuthCallback()
}

// Handle OAuth callback on mount
onMounted(async () => {
  try {
    // Check if this is an OAuth callback
    const { data, error: authError } = await supabase.auth.getSession()

    if (authError) {
      throw authError
    }

    if (data.session) {
      // User is authenticated, handle the callback
      await handleAuthCallback()
    } else {
      // No session, redirect to login
      router.push('/auth/login')
    }
  } catch (err) {
    console.error('OAuth callback error:', err)
    error.value = 'Error al procesar la autenticación'
    statusMessage.value = 'Error en la autenticación'
  }
})
</script>
