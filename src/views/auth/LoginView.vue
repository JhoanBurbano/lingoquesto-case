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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido de vuelta!</h1>
          <p class="text-gray-600">Inicia sesión en tu cuenta de LingoQuesto</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
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
                :disabled="loading"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="tu@email.com"
              />
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                :disabled="loading"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <!-- Forgot Password Link -->
            <div class="flex justify-end">
              <router-link
                to="/auth/forgot-password"
                :class="[
                  'text-sm transition-colors',
                  loading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-purple-600 hover:text-purple-700',
                ]"
                :tabindex="loading ? -1 : 0"
              >
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Login Button -->
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
                Iniciando sesión...
              </span>
              <span v-else>Iniciar Sesión</span>
            </button>

            <!-- Test Credentials Button (Development Only) -->
            <button
              v-if="showTestCredentials"
              type="button"
              @click="fillTestCredentials"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              🧪 Usar Credenciales de Prueba
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <!-- Google OAuth Button -->
          <button
            @click="handleGoogleLogin"
            :disabled="loading"
            class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center mt-6">
            <p class="text-gray-600">
              ¿No tienes una cuenta?
              <router-link
                to="/auth/register"
                :class="[
                  'font-medium transition-colors',
                  loading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-purple-600 hover:text-purple-700',
                ]"
                :tabindex="loading ? -1 : 0"
              >
                Regístrate aquí
              </router-link>
            </p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link
            to="/welcome"
            :class="[
              'transition-colors flex items-center justify-center space-x-2',
              loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700',
            ]"
            :tabindex="loading ? -1 : 0"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
})

// UI state
const loading = ref(false)
const error = ref('')

// Computed
const showTestCredentials = computed(() => {
  return import.meta.env.VITE_TEST_EMAIL && import.meta.env.VITE_TEST_PASSWORD
})

// Handle form submission
const handleLogin = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.signIn(form.email, form.password)

    if (result.success) {
      toast.success('¡Bienvenido de vuelta!')

      // Redirect to intended page or dashboard
      const redirectTo = (route.query.redirect as string) || '/dashboard'
      router.push(redirectTo)
    } else {
      error.value = result.error || 'Error al iniciar sesión'
      toast.error('Error al iniciar sesión')
    }
  } catch (err) {
    error.value = 'Error inesperado al iniciar sesión'
    toast.error('Error inesperado al iniciar sesión')
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Handle Google OAuth
const handleGoogleLogin = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.signInWithGoogle()

    if (result.success) {
      toast.success('Redirigiendo a Google...')
    } else {
      error.value = result.error || 'Error al iniciar sesión con Google'
      toast.error('Error al iniciar sesión con Google')
    }
  } catch (err) {
    error.value = 'Error inesperado al iniciar sesión con Google'
    toast.error('Error inesperado al iniciar sesión con Google')
    console.error('Google login error:', err)
  } finally {
    loading.value = false
  }
}

// Fill test credentials
const fillTestCredentials = () => {
  if (!showTestCredentials.value) return

  form.email = import.meta.env.VITE_TEST_EMAIL || ''
  form.password = import.meta.env.VITE_TEST_PASSWORD || ''

  toast.success('Credenciales de prueba cargadas')
}

// Watch form changes to clear errors
onMounted(() => {
  // Clear any existing errors
  authStore.clearError()
})
</script>
