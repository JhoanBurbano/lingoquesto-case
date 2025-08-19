<template>
  <div id="app">
    <!-- Loading Screen -->
    <div
      v-if="authStore.loading"
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
        <p class="text-gray-600">Inicializando LingoQuesto...</p>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/layouts/AppLayout.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()

// Determinar si la ruta actual es pública
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

// Initialize authentication on app start
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>
