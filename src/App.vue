<template>
  <div id="app">
    <!-- Loading Screen -->
    <div
      v-if="authStore.loading || isRedirecting"
      class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6"
        >
          <span class="text-white text-2xl font-bold">LQ</span>
        </div>
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Public Routes (Welcome, Support, Auth) - Sin AppLayout -->
    <div v-else-if="isPublicRoute" class="min-h-screen">
      <router-view />
    </div>

    <!-- Protected Routes - Con AppLayout -->
    <AppLayout v-else>
      <router-view />
    </AppLayout>

    <!-- Toast Notifications -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'
import AppLayout from './components/layouts/AppLayout.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// State for redirect handling
const isRedirecting = ref(false)

// Computed properties
const isPublicRoute = computed(() => {
  const publicRoutes = [
    '/welcome',
    '/support',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
  ]
  return publicRoutes.includes(route.path)
})

const loadingMessage = computed(() => {
  if (isRedirecting.value) {
    return 'Redirigiendo...'
  }
  return 'Inicializando LingoQuesto...'
})

// Watch for route changes to handle redirects
const handleRouteChange = () => {
  // If user is not authenticated and trying to access protected route
  if (!authStore.isAuthenticated && !isPublicRoute.value) {
    isRedirecting.value = true
    console.log('🔄 Redirecting unauthenticated user to login')

    // Small delay to show loading state
    setTimeout(() => {
      router
        .push({
          path: '/auth/login',
          query: { redirect: route.fullPath },
        })
        .finally(() => {
          isRedirecting.value = false
        })
    }, 100)
  }
}

// Initialize authentication on app start
onMounted(async () => {
  try {
    await authStore.initializeAuth()

    // Handle initial route after auth is initialized
    handleRouteChange()
  } catch (error) {
    console.error('Error initializing auth:', error)
  }
})

// Watch for route changes
watch(() => route.path, handleRouteChange)
</script>
