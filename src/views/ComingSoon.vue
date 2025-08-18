<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <DecorativePattern />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex items-center justify-center min-h-screen p-6">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Animated Character -->
        <div
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{ scale: 1, rotate: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="mb-8"
        >
          <LingoCharacter size="lg" />
        </div>

        <!-- Main Card -->
        <div
          v-motion
          :initial="{ y: 50, opacity: 0 }"
          :enter="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.3 }"
        >
          <Card class="p-12 bg-white/90 backdrop-blur-sm border-2 border-blue-100 shadow-2xl">
            <!-- Status Badge -->
            <div
              v-motion
              :initial="{ scale: 0 }"
              :enter="{ scale: 1 }"
              :transition="{ duration: 0.5, delay: 0.6 }"
              class="mb-6"
            >
              <Badge
                class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2 text-base inline-flex items-center gap-2"
              >
                <Construction class="w-4 h-4" />
                En Desarrollo
              </Badge>
            </div>

            <!-- Title -->
            <h1
              v-motion
              :initial="{ y: 20, opacity: 0 }"
              :enter="{ y: 0, opacity: 1 }"
              :transition="{ duration: 0.6, delay: 0.8 }"
              class="text-4xl font-bold text-gray-900 mb-4"
            >
              {{ sectionName }} estará disponible pronto
            </h1>

            <!-- Description -->
            <p
              v-motion
              :initial="{ y: 20, opacity: 0 }"
              :enter="{ y: 0, opacity: 1 }"
              :transition="{ duration: 0.6, delay: 1 }"
              class="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
            >
              {{ description }}
            </p>

            <!-- Features Preview -->
            <div
              v-motion
              :initial="{ y: 30, opacity: 0 }"
              :enter="{ y: 0, opacity: 1 }"
              :transition="{ duration: 0.6, delay: 1.2 }"
              class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
              <div
                class="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3"
                >
                  <Sparkles class="w-6 h-6 text-white" />
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">Interfaz Intuitiva</h3>
                <p class="text-sm text-gray-600 text-center">
                  Diseño fácil de usar para todos los niveles
                </p>
              </div>

              <div
                class="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-3"
                >
                  <Clock class="w-6 h-6 text-white" />
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">Ahorro de Tiempo</h3>
                <p class="text-sm text-gray-600 text-center">
                  Herramientas que optimizan tu trabajo
                </p>
              </div>

              <div
                class="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mb-3"
                >
                  <WandSparkles class="w-6 h-6 text-white" />
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">IA Integrada</h3>
                <p class="text-sm text-gray-600 text-center">
                  Tecnología avanzada para mejores resultados
                </p>
              </div>
            </div>

            <!-- Action Button -->
            <div
              v-motion
              :initial="{ y: 20, opacity: 0 }"
              :enter="{ y: 0, opacity: 1 }"
              :transition="{ duration: 0.6, delay: 1.4 }"
            >
              <GradientButton @click="handleBackToDashboard" class="px-8 py-3 text-lg">
                <span class="flex flex-row gap-2 items-center">
                  <ArrowLeft class="w-5 h-5 mr-2" />
                  Volver al Dashboard
                </span>
              </GradientButton>
            </div>

            <!-- Progress Indicator -->
            <div
              v-motion
              :initial="{ scaleX: 0 }"
              :enter="{ scaleX: 1 }"
              :transition="{ duration: 1, delay: 1.6 }"
              class="mt-8 pt-6 border-t border-gray-200"
            >
              <div class="flex items-center justify-center gap-3 text-sm text-gray-500">
                <div class="flex gap-1">
                  <div
                    v-for="i in 3"
                    :key="i"
                    v-motion
                    :initial="{ scale: 0 }"
                    :enter="{ scale: 1 }"
                    :transition="{ delay: 1.8 + i * 0.1 }"
                    class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                  <div v-for="i in 2" :key="'k' + i" class="w-2 h-2 bg-gray-300 rounded-full" />
                </div>
                <span>60% completado</span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Footer note -->
        <p
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1 }"
          :transition="{ duration: 0.6, delay: 2 }"
          class="mt-6 text-sm text-gray-500"
        >
          Mientras tanto, puedes explorar el
          <button
            @click="handleBackToDashboard"
            class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
          >
            Dashboard Principal
          </button>
          o el
          <button
            @click="() => setCurrentSection('oral-practice')"
            class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
          >
            Chat de Voz
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import GradientButton from '@/components/molecules/GradientButton.vue'
import Badge from '@/components/atoms/Badge.vue'
import Card from '@/components/molecules/Card/Card.vue'
import { ArrowLeft, Clock, Construction, Sparkles, WandSparkles } from 'lucide-vue-next'

interface Props {
  sectionName?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  sectionName: 'Esta funcionalidad',
  description: 'Estamos trabajando en una experiencia increíble para esta sección.',
})

const { setCurrentSection, backToDashboard } = useSidebar()

function handleBackToDashboard() {
  backToDashboard()
}
</script>

<style scoped>
/* No se requieren estilos adicionales */
</style>
