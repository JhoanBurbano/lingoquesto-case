<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5] relative overflow-hidden">
    <DecorativePattern class="top-0 right-0 w-96 h-48" />

    <div class="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <LingoCharacter variant="teaching" class="w-12 h-12" :animated="false" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 font-sat-bold">Caso de estudio</h1>
            <p class="text-gray-600">
              LingoQuesto es una plataforma de práctica oral de idiomas que permite a los usuarios
              mejorar su habilidad para hablar en inglés.
            </p>
          </div>
        </div>

        <Button
          @click="onNavigateToHome"
          variant="outline"
          class="border-gray-300 hover:bg-gray-50 z-10"
        >
          <Home class="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </div>

      <!-- Navegación de slides -->
      <div class="flex items-center justify-center mb-8">
        <div
          class="flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-2"
        >
          <Button
            @click="previousSlide"
            :disabled="currentSlide === 0"
            variant="ghost"
            size="sm"
            class="w-10 h-10 p-0 hover:bg-gray-100"
          >
            <ChevronLeft class="w-5 h-5" />
          </Button>

          <div class="flex gap-1 px-4">
            <div
              v-for="(slide, index) in slides"
              :key="slide.id"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full cursor-pointer transition-all duration-200"
              :class="index === currentSlide ? 'bg-[#967AFE]' : 'bg-gray-300 hover:bg-gray-400'"
            />
          </div>

          <Button
            @click="nextSlide"
            :disabled="currentSlide === slides.length - 1"
            variant="ghost"
            size="sm"
            class="w-10 h-10 p-0 hover:bg-gray-100"
          >
            <ChevronRight class="w-5 h-5" />
          </Button>
        </div>
      </div>

      <!-- Contenido del slide actual -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-8">
          <!-- Slide 1: Introducción -->
          <div v-if="currentSlide === 0" class="text-center space-y-8">
            <div class="mb-8">
              <LingoCharacter variant="celebrating" size="lg" :animated="false" />
            </div>
            <Badge
              class="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-lg px-6 py-2"
            >
              Prueba Técnica - Frontend Developer Senior
            </Badge>
            <h2 class="text-5xl font-bold text-gray-900 mb-4">LingoQuesto Design System</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema de diseño completo para la plataforma de IA de práctica oral de idiomas,
              incluyendo componentes, tokens, patrones y guidelines.
            </p>
          </div>

          <!-- Slide 2: Principios de Diseño -->
          <div v-if="currentSlide === 1" class="space-y-8">
            <Card class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Principios de Diseño</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    <Sparkles class="w-5 h-5 text-blue-600 mr-2" />
                    Accesibilidad Universal
                  </h4>
                  <p class="text-sm text-gray-600">
                    Diseñado para usuarios con poca experiencia tecnológica, cumpliendo estándares
                    WCAG AA para garantizar que todos puedan usar la plataforma.
                  </p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    <Zap class="w-5 h-5 text-purple-600 mr-2" />
                    Gamificación Intuitiva
                  </h4>
                  <p class="text-sm text-gray-600">
                    Elementos gamificados que motivan sin abrumar, manteniendo el foco en el
                    aprendizaje y la experiencia educativa.
                  </p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield class="w-5 h-5 text-green-600 mr-2" />
                    Consistencia Visual
                  </h4>
                  <p class="text-sm text-gray-600">
                    Identidad visual coherente en todos los touchpoints, manteniendo la confianza y
                    familiaridad del usuario.
                  </p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                    <Target class="w-5 h-5 text-orange-600 mr-2" />
                    Enfoque Pedagógico
                  </h4>
                  <p class="text-sm text-gray-600">
                    Diseño centrado en objetivos educativos, facilitando el seguimiento del progreso
                    y la toma de decisiones pedagógicas.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <!-- Slide 3: Tokens de Diseño -->
          <div v-if="currentSlide === 2" class="space-y-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Tokens de Diseño</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette class="w-5 h-5 text-blue-600 mr-2" />
                  Colores
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#967AFE] rounded-lg"></div>
                    <span class="text-sm text-gray-700">Primary: #967AFE</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#48D19C] rounded-lg"></div>
                    <span class="text-sm text-gray-700">Secondary: #48D19C</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#FFAF54] rounded-lg"></div>
                    <span class="text-sm text-gray-700">Accent: #FFAF54</span>
                  </div>
                </div>
              </Card>

              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <Code class="w-5 h-5 text-purple-600 mr-2" />
                  Tipografía
                </h4>
                <div class="space-y-3">
                  <div class="text-2xl font-bold text-gray-900">Heading 1</div>
                  <div class="text-lg font-semibold text-gray-800">Heading 2</div>
                  <div class="text-base text-gray-700">Body Text</div>
                  <div class="text-sm text-gray-600">Caption</div>
                </div>
              </Card>

              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <Target class="w-5 h-5 text-green-600 mr-2" />
                  Espaciado
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-4 h-4 bg-gray-300 rounded"></div>
                    <span class="text-sm text-gray-700">4px (xs)</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gray-300 rounded"></div>
                    <span class="text-sm text-gray-700">8px (sm)</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-gray-300 rounded"></div>
                    <span class="text-sm text-gray-700">16px (md)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Slide 4: Componentes -->
          <div v-if="currentSlide === 3" class="space-y-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Sistema de Componentes</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Componentes Atómicos</h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <Button size="sm">Button</Button>
                    <span class="text-sm text-gray-600">Botones con variantes</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <Badge class="bg-blue-100 text-blue-700">Insignia</Badge>
                    <span class="text-sm text-gray-600">Etiquetas informativas</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white text-sm font-bold"
                    >
                      AV
                    </div>
                    <span class="text-sm text-gray-600">Avatares personalizables</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-4">Componentes Moleculares</h4>
                <div class="space-y-3">
                  <Card class="p-4">
                    <h5 class="font-medium text-gray-900 mb-2">Card Component</h5>
                    <p class="text-sm text-gray-600">Contenedores con sombras y bordes</p>
                  </Card>
                  <div class="flex items-center gap-3">
                    <div
                      class="w-16 h-16 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold"
                    >
                      <Mic class="w-6 h-6" />
                    </div>
                    <span class="text-sm text-gray-600">Iconos con gradientes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 5: Patrones de Interacción -->
          <div v-if="currentSlide === 4" class="space-y-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Patrones de Interacción</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle class="w-5 h-5 text-blue-600 mr-2" />
                  Feedback Inmediato
                </h4>
                <p class="text-sm text-gray-600 mb-4">
                  Los usuarios reciben confirmación visual inmediata de sus acciones para mantener
                  la confianza.
                </p>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    <span class="text-sm text-gray-700">Confirmaciones de éxito</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Bell class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-700">Notificaciones contextuales</span>
                  </div>
                </div>
              </Card>

              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 class="w-5 h-5 text-purple-600 mr-2" />
                  Progreso Visual
                </h4>
                <p class="text-sm text-gray-600 mb-4">
                  Barras de progreso y métricas visuales para motivar el aprendizaje continuo.
                </p>
                <div class="space-y-3">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-[#967AFE] h-2 rounded-full" style="width: 75%"></div>
                  </div>
                  <div class="text-sm text-gray-600">75% completado</div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Slide 6: Implementación -->
          <div v-if="currentSlide === 5" class="space-y-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Implementación Técnica</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings class="w-5 h-5 text-gray-600 mr-2" />
                  Configuración
                </h4>
                <div class="space-y-3">
                  <div class="text-sm text-gray-700">
                    <strong>Framework:</strong> Vue 3 + TypeScript
                  </div>
                  <div class="text-sm text-gray-700"><strong>Styling:</strong> Tailwind CSS v4</div>
                  <div class="text-sm text-gray-700"><strong>Build:</strong> Vite</div>
                  <div class="text-sm text-gray-700">
                    <strong>Testing:</strong> Vitest + Playwright
                  </div>
                </div>
              </Card>

              <Card class="p-6">
                <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                  <Play class="w-5 h-5 text-green-600 mr-2" />
                  Desarrollo
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    <span class="text-sm text-gray-700">Componentes reutilizables</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    <span class="text-sm text-gray-700">Sistema de tipos robusto</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    <span class="text-sm text-gray-700">Testing automatizado</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    <span class="text-sm text-gray-700">Documentación viva</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con información del slide -->
      <div class="text-center mt-8">
        <div class="text-sm text-gray-500">
          Slide {{ currentSlide + 1 }} de {{ slides.length }} -
          {{ slides[currentSlide].title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  MessageCircle,
  Target,
  Zap,
  Shield,
  Palette,
  Code,
  CheckCircle,
  Play,
  Mic,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-vue-next'
import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import Card from '@/components/molecules/Card/Card.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'SlidesView' })
const router = useRouter()

const onNavigateToHome = () => {
  router.replace('/dashboard')
}

// Estado
const currentSlide = ref(0)

// Slides
const slides = [
  {
    id: 1,
    title: 'LingoQuesto - Design System',
    subtitle: 'Sistema de Diseño Completo',
  },
  {
    id: 2,
    title: 'Fundamentos del Sistema',
    subtitle: 'Principios y Filosofía de Diseño',
  },
  {
    id: 3,
    title: 'Tokens de Diseño',
    subtitle: 'Fundación del Sistema Visual',
  },
  {
    id: 4,
    title: 'Sistema de Componentes',
    subtitle: 'Arquitectura Modular',
  },
  {
    id: 5,
    title: 'Patrones de Interacción',
    subtitle: 'UX y Usabilidad',
  },
  {
    id: 6,
    title: 'Implementación Técnica',
    subtitle: 'Desarrollo y Despliegue',
  },
]

// Métodos
const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}
</script>
