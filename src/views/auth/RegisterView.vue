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
          <h1 class="text-3xl font-bold text-gray-800 mb-2">¡Únete a LingoQuesto!</h1>
          <p class="text-gray-600">Crea tu cuenta y comienza tu aventura de aprendizaje</p>
        </div>

        <!-- Registration Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Full Name Field -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Tu nombre completo"
                :disabled="loading"
              />
            </div>

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

            <!-- Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipo de usuario eres?
              </label>
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="relative flex cursor-pointer rounded-xl border-2 transition-all duration-200 hover:bg-purple-50 focus:outline-none"
                  :class="[
                    form.role === 'student'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300',
                  ]"
                >
                  <input
                    v-model="form.role"
                    type="radio"
                    name="role"
                    value="student"
                    class="sr-only"
                    :disabled="loading"
                  />
                  <div class="flex w-full items-center justify-between p-4">
                    <div class="flex items-center">
                      <div class="text-sm">
                        <p class="font-medium text-gray-900">Estudiante</p>
                        <p class="text-gray-500">Aprende idiomas</p>
                      </div>
                    </div>
                    <div class="shrink-0 text-purple-600">
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </label>

                <label
                  class="relative flex cursor-pointer rounded-xl border-2 transition-all duration-200 hover:bg-purple-50 focus:outline-none"
                  :class="[
                    form.role === 'teacher'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300',
                  ]"
                >
                  <input
                    v-model="form.role"
                    type="radio"
                    name="role"
                    value="teacher"
                    class="sr-only"
                    :disabled="loading"
                  />
                  <div class="flex w-full items-center justify-between p-4">
                    <div class="flex items-center">
                      <div class="text-sm">
                        <p class="font-medium text-gray-900">Profesor</p>
                        <p class="text-gray-500">Enseña idiomas</p>
                      </div>
                    </div>
                    <div class="shrink-0 text-purple-600">
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Role Selection Indicator -->
              <div
                v-if="form.role"
                class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span class="text-sm font-medium text-purple-700">
                    Rol seleccionado:
                    <span class="capitalize">{{
                      form.role === 'teacher' ? 'Profesor' : 'Estudiante'
                    }}</span>
                  </span>
                </div>
              </div>
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
                minlength="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                :disabled="loading"
              />
              <p class="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                :disabled="loading"
              />
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  required
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  :disabled="loading"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-700">
                  Acepto los{' '}
                  <a href="#" class="text-purple-600 hover:text-purple-700 underline">
                    términos y condiciones
                  </a>
                  {' '}y la{' '}
                  <a href="#" class="text-purple-600 hover:text-purple-700 underline">
                    política de privacidad
                  </a>
                </label>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              :disabled="loading || !form.acceptTerms || form.password !== form.confirmPassword"
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
                Creando cuenta...
              </span>
              <span v-else>Crear Cuenta</span>
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
            @click="handleGoogleRegister"
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

          <!-- Sign In Link -->
          <div class="text-center mt-6">
            <p class="text-gray-600">
              ¿Ya tienes una cuenta?
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  fullName: '',
  email: '',
  role: 'student' as 'student' | 'teacher',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

// UI state
const loading = ref(false)
const error = ref('')

// Handle form submission
const handleRegister = async () => {
  if (loading.value) return

  // Validation
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (form.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  if (!form.acceptTerms) {
    error.value = 'Debes aceptar los términos y condiciones'
    return
  }

  if (!form.role) {
    error.value = 'Debes seleccionar un tipo de usuario'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.signUp(form.email, form.password, form.fullName, form.role)

    if (result.success) {
      toast.success(
        `¡Cuenta creada exitosamente como ${form.role === 'teacher' ? 'profesor' : 'estudiante'}!`,
      )
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Error al crear la cuenta'
    }
  } catch (err) {
    error.value = 'Error inesperado al crear la cuenta'
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}

// Handle Google OAuth
const handleGoogleRegister = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const result = await authStore.signInWithGoogle()

    if (result.success) {
      toast.success('Redirigiendo a Google...')
    } else {
      error.value = result.error || 'Error al registrarse con Google'
    }
  } catch (err) {
    error.value = 'Error inesperado al registrarse con Google'
    console.error('Google registration error:', err)
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
