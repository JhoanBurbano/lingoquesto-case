<template>
  <div
    class="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 overflow-hidden z-50"
  >
    <!-- Fondo animado -->
    <div class="absolute inset-0">
      <!-- Círculos flotantes -->
      <div
        v-motion
        :animate="{ y: [0, -20, 0], rotate: [0, 5, 0] }"
        :transition="{ duration: 6, repeat: Infinity, ease: 'easeInOut' }"
        class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
      />
      <div
        v-motion
        :animate="{ y: [0, 30, 0], rotate: [0, -5, 0] }"
        :transition="{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }"
        class="absolute top-60 right-20 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-indigo-500/20 rounded-full blur-xl"
      />
      <div
        v-motion
        :animate="{ y: [0, -40, 0], x: [0, 20, 0] }"
        :transition="{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }"
        class="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-blue-500/20 rounded-full blur-xl"
      />

      <!-- Patrón decorativo -->
      <div class="absolute inset-0 opacity-5">
        <DecorativePattern />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
      <!-- Personaje -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8 }"
        class="mb-8"
      >
        <div class="relative mb-6">
          <div
            v-motion
            :animate="{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }"
            :transition="{ duration: 4, repeat: Infinity, ease: 'easeInOut' }"
            class="relative"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30 scale-150"
            ></div>
            <LingoCharacter size="xl" class="relative z-10" />
          </div>

          <!-- Iconos orbitando -->
          <div
            v-for="(feature, index) in features"
            :key="index"
            v-motion
            :animate="{
              rotate: [0, 360],
              scale: currentFeature === index ? [1, 1.2, 1] : 1,
            }"
            :transition="{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5 },
            }"
            class="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
            :class="
              currentFeature === index
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : ''
            "
            :style="orbStyle(index)"
          >
            <component :is="feature.icon" class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Marca / título -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="mb-6"
      >
        <h1 class="text-7xl font-black text-gray-900 mb-4 leading-tight">
          <span
            class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
            >LingoQuesto</span
          >
        </h1>
        <div class="flex items-center justify-center gap-2 mb-4">
          <Sparkles class="w-6 h-6 text-purple-500" />
          <p class="text-2xl text-gray-700 font-medium">Tutor de IA para Práctica Oral</p>
          <Sparkles class="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <!-- Feature dinámica -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.4 }"
        class="mb-8"
      >
        <Badge
          class="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-lg px-6 py-3 mb-4"
        >
          <Transition name="fade-slide-x" mode="out-in">
            <div :key="currentFeature" class="flex items-center gap-2">
              <component :is="features[currentFeature].icon" class="w-5 h-5" />
              {{ features[currentFeature].text }}
            </div>
          </Transition>
        </Badge>
      </div>

      <!-- Botones -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.6 }"
        class="flex flex-col gap-6 items-center justify-center"
      >
        <GradientButton
          @click="onNavigateToDashboard"
          class="text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          <span class="flex gap-6">
            <Play class="w-6 h-6 mr-3" />
            Iniciar Demo
          </span>
        </GradientButton>

        <p
          @click="onNavigateToSlides"
          class="text-md font-semibold text-purple-700 transform hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          Ver Caso de Estudio
        </p>
      </div>

      <!-- Info inferior -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.8 }"
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center flex flex-col"
      >
        <p class="text-gray-600 text-lg mb-2">Prueba Técnica - UX/UI Frontend Developer Senior</p>
        <div class="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Vue 3 + TypeScript</span>
          <span>•</span>
          <span>Tailwind CSS v4</span>
          <span>•</span>
          <span>WCAG AA</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import GradientButton from '@/components/molecules/GradientButton.vue'
import Badge from '@/components/atoms/Badge.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import { Play, Sparkles, MessageCircle, Users, BookOpen } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const onNavigateToDashboard = () => {
  router.replace('/dashboard')
}

const onNavigateToSlides = () => {
  router.replace('/slides')
}

const features = [
  { icon: MessageCircle, text: 'Práctica Oral Inteligente' },
  { icon: Users, text: 'Seguimiento de Estudiantes' },
  { icon: BookOpen, text: 'Actividades Personalizadas' },
] as const

const currentFeature = ref(0)
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    currentFeature.value = (currentFeature.value + 1) % features.length
  }, 3000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

function orbStyle(index: number) {
  const top = 50 + 35 * Math.sin((index * 120 * Math.PI) / 180)
  const left = 50 + 35 * Math.cos((index * 120 * Math.PI) / 180)
  return { top: top + '%', left: left + '%', transform: 'translate(-50%, -50%)' }
}
</script>

<style scoped>
.fade-slide-x-enter-active,
.fade-slide-x-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-x-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.fade-slide-x-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
