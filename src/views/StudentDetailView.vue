<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5]">
    <DecorativePattern class="top-0 right-0 w-64 h-32" />

    <div class="container mx-auto sm:px-6 py-6 sm:py-8">
      <!-- Header -->
      <div
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="flex items-center gap-4 mb-6 sm:mb-8"
      >
        <!-- Mobile sidebar toggle -->

        <Button
          variant="ghost"
          size="sm"
          @click="onBack"
          class="flex items-center gap-2 text-gray-600 hover:text-[#967AFE] hover:bg-[#967AFE]/10"
        >
          <ArrowLeft class="w-4 h-4" />
          {{ isMobile ? 'Volver' : 'Volver a estudiantes' }}
        </Button>
      </div>

      <!-- Student Header Card -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-gray-100 mb-6 sm:mb-8 relative overflow-hidden"
      >
        <DecorativePattern class="top-0 right-0 w-32 h-16 opacity-5" />

        <div class="flex flex-col sm:flex-row items-start sm:justify-between gap-4 sm:gap-6">
          <div class="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Avatar class="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white shadow-lg">
              <AvatarImage :src="student.avatar" :alt="student.name" />
              <AvatarFallback
                :class="[
                  'bg-gradient-to-br',
                  getLevelColor(student.level),
                  'text-white font-bold text-lg sm:text-xl',
                ]"
              >
                {{ getInitials(student.name) }}
              </AvatarFallback>
            </Avatar>

            <div class="space-y-2 flex-1">
              <h1
                class="font-['Satoshi',sans-serif] text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900"
              >
                {{ student.name }}
              </h1>

              <div class="flex items-center gap-3">
                <Badge
                  :class="[
                    'bg-gradient-to-r',
                    getLevelColor(student.level),
                    'text-white border-0 px-4 py-1',
                  ]"
                >
                  Nivel {{ student.level }}
                </Badge>

                <div
                  v-if="student.streak > 0"
                  class="flex items-center gap-1 bg-[#FBEB6F]/20 px-3 py-1 rounded-full"
                >
                  <Award class="w-4 h-4 text-[#FFAF54]" />
                  <span class="text-sm font-medium text-[#FFAF54]">
                    {{ student.streak }} días consecutivos
                  </span>
                </div>
              </div>

              <p class="text-gray-600 flex items-center gap-1">
                <Clock class="w-4 h-4" />
                Última actividad: {{ student.lastActiveDate }}
              </p>
            </div>
          </div>

          <div class="text-center sm:text-right">
            <ProgressRing :progress="overallProgress" :size="isMobile ? 80 : 100">
              <div class="text-center">
                <span class="font-['Satoshi',sans-serif] text-lg sm:text-xl font-bold text-gray-900"
                  >{{ overallProgress }}%</span
                >
                <p class="text-xs text-gray-500">Progreso</p>
              </div>
            </ProgressRing>
          </div>
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="0.1"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <MetricCard
          title="Práctica Oral"
          :value="`${student.oralPracticeHours}h`"
          :change="15"
          changeLabel="vs. mes anterior"
          gradient="from-[#967AFE] to-[#48D19C]"
          description="Tiempo total de práctica oral este mes"
        >
          <template #icon>
            <Mic class="w-6 h-6" />
          </template>
        </MetricCard>

        <MetricCard
          title="Fluidez"
          :value="`${student.fluencyScore}%`"
          :change="8"
          changeLabel="mejora este mes"
          gradient="from-[#48D19C] to-[#9AD0F0]"
          description="Nivel de fluidez en conversación"
        >
          <template #icon>
            <TrendingUp class="w-6 h-6" />
          </template>
        </MetricCard>

        <MetricCard
          title="Pronunciación"
          :value="`${student.pronunciationScore}%`"
          :change="12"
          changeLabel="mejora este mes"
          gradient="from-[#FFAF54] to-[#FBEB6F]"
          description="Precisión en pronunciación"
        >
          <template #icon>
            <Volume2 class="w-6 h-6" />
          </template>
        </MetricCard>

        <MetricCard
          title="Actividades"
          :value="`${student.activitiesCompleted}/${student.totalActivities}`"
          :change="25"
          changeLabel="completadas"
          gradient="from-[#967AFE] to-[#FFAF54]"
          description="Ejercicios completados"
        >
          <template #icon>
            <Target class="w-6 h-6" />
          </template>
        </MetricCard>
      </div>

      <!-- Detailed Content -->
      <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="0.2">
        <Tabs v-model="tab" class="space-y-4 sm:space-y-6">
          <TabsList
            class="bg-white rounded-xl p-1 shadow-sm grid grid-cols-2 sm:grid-cols-4 w-full"
          >
            <TabsTrigger
              value="overview"
              class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#967AFE] data-[state=active]:to-[#48D19C] data-[state=active]:text-white text-xs sm:text-sm"
            >
              {{ isMobile ? 'Info' : 'Resumen' }}
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#967AFE] data-[state=active]:to-[#48D19C] data-[state=active]:text-white text-xs sm:text-sm"
            >
              {{ isMobile ? 'Oral' : 'Práctica Oral' }}
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#967AFE] data-[state=active]:to-[#48D19C] data-[state=active]:text-white text-xs sm:text-sm"
            >
              {{ isMobile ? 'Progreso' : 'Progreso Detallado' }}
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              class="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#967AFE] data-[state=active]:to-[#48D19C] data-[state=active]:text-white text-xs sm:text-sm"
            >
              {{ isMobile ? 'Tips' : 'Recomendaciones' }}
            </TabsTrigger>
          </TabsList>

          <!-- Overview -->
          <TabsContent value="overview" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Recent Sessions -->
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <Calendar class="w-5 h-5 text-[#967AFE]" />
                    Sesiones Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div
                    v-for="(session, index) in student.recentSessions"
                    :key="index"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ session.type }}</p>
                      <p class="text-sm text-gray-500">{{ session.date }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-[#967AFE]">{{ session.score }}%</p>
                      <p class="text-sm text-gray-500">{{ session.duration }} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Strengths and Improvements -->
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2">
                    <BookOpen class="w-5 h-5 text-[#48D19C]" />
                    Análisis de Desempeño
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>
                    <h4 class="font-semibold text-[#48D19C] mb-2 flex items-center gap-2">
                      <TrendingUp class="w-4 h-4" />
                      Fortalezas
                    </h4>
                    <div class="space-y-2">
                      <div
                        v-for="(strength, index) in student.strengths"
                        :key="index"
                        class="flex items-center gap-2"
                      >
                        <div class="w-2 h-2 bg-[#48D19C] rounded-full" />
                        <span class="text-sm text-gray-700">{{ strength }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-semibold text-[#FFAF54] mb-2 flex items-center gap-2">
                      <Target class="w-4 h-4" />
                      Áreas de Mejora
                    </h4>
                    <div class="space-y-2">
                      <div
                        v-for="(improvement, index) in student.improvements"
                        :key="index"
                        class="flex items-center gap-2"
                      >
                        <div class="w-2 h-2 bg-[#FFAF54] rounded-full" />
                        <span class="text-sm text-gray-700">{{ improvement }}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <!-- Voice -->
          <TabsContent value="voice" class="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Mic class="w-5 h-5 text-[#967AFE]" />
                  Grabaciones de Práctica Oral
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <VoiceActivityIndicator
                  v-for="recording in student.voiceRecordings"
                  :key="recording.id"
                  :isActive="true"
                  :duration="recording.duration"
                  :onPlay="() => onPlay()"
                  :onPause="() => onPause()"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Pronunciación</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="(detail, index) in student.pronunciationDetails"
                    :key="index"
                    class="bg-[#F9F6FF] rounded-xl p-4"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-mono font-bold text-[#967AFE]">/{{ detail.phoneme }}/</span>
                      <span class="text-sm font-medium text-gray-600"
                        >{{ detail.attempts }} intentos</span
                      >
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Precisión</span>
                        <span class="text-sm font-bold text-gray-900">{{ detail.accuracy }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          v-motion
                          :initial="{ width: '0%' }"
                          :enter="{ width: detail.accuracy + '%' }"
                          :transition="{ duration: 1, delay: index * 0.1 }"
                          :class="[
                            'h-2 rounded-full',
                            detail.accuracy >= 80
                              ? 'bg-[#48D19C]'
                              : detail.accuracy >= 60
                                ? 'bg-[#FBEB6F]'
                                : 'bg-[#FFAF54]',
                          ]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Progress -->
          <TabsContent value="progress" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Meta semanal</span>
                      <span class="font-bold text-[#967AFE]">{{ student.weeklyGoal }}h</span>
                    </div>

                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-600">Progreso actual</span>
                        <span class="text-sm font-bold text-gray-900">
                          {{ student.oralPracticeHours }}/{{ student.weeklyGoal }}h
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          v-motion
                          :initial="{ width: '0%' }"
                          :enter="{
                            width:
                              Math.min(
                                (student.oralPracticeHours / student.weeklyGoal) * 100,
                                100,
                              ) + '%',
                          }"
                          :transition="{ duration: 1.5 }"
                          class="h-3 bg-gradient-to-r from-[#967AFE] to-[#48D19C] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparación de Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-6">
                    <div class="text-center">
                      <ProgressRing :progress="student.fluencyScore" :size="80">
                        <div class="text-center">
                          <span class="font-bold text-lg text-gray-900"
                            >{{ student.fluencyScore }}%</span
                          >
                          <p class="text-xs text-gray-500">Fluidez</p>
                        </div>
                      </ProgressRing>
                    </div>

                    <div class="text-center">
                      <ProgressRing :progress="student.pronunciationScore" :size="80">
                        <div class="text-center">
                          <span class="font-bold text-lg text-gray-900"
                            >{{ student.pronunciationScore }}%</span
                          >
                          <p class="text-xs text-gray-500">Pronunciación</p>
                        </div>
                      </ProgressRing>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <!-- Recommendations -->
          <TabsContent value="recommendations" class="space-y-6">
            <Card class="relative overflow-hidden">
              <DecorativePattern class="top-0 right-0 w-24 h-12" />

              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <LingoCharacter variant="teaching" class="w-8 h-8" />
                  Recomendaciones de Lingo IA
                </CardTitle>
              </CardHeader>

              <CardContent class="space-y-6">
                <div class="bg-gradient-to-r from-[#967AFE]/10 to-[#48D19C]/10 rounded-xl p-6">
                  <h4 class="font-semibold text-[#967AFE] mb-3">Enfoque Recomendado</h4>
                  <p class="text-gray-700 mb-4">
                    Basado en el análisis de {{ student.name }}, recomiendo enfocarse en ejercicios
                    de conversación estructurada para mejorar la fluidez, especialmente en temas
                    cotidianos.
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GradientButton variant="primary">
                      <template #icon>
                        <BookOpen class="w-4 h-4" />
                      </template>
                      Crear Actividad Personalizada
                    </GradientButton>

                    <GradientButton variant="secondary">
                      <template #icon>
                        <Mic class="w-4 h-4" />
                      </template>
                      Ejercicios de Pronunciación
                    </GradientButton>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <h4 class="font-semibold text-[#48D19C] flex items-center gap-2">
                      <TrendingUp class="w-4 h-4" />
                      Ejercicios Sugeridos
                    </h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#48D19C] rounded-full" />
                        Diálogos interactivos nivel {{ student.level }}
                      </li>
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#48D19C] rounded-full" />
                        Ejercicios de entonación
                      </li>
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#48D19C] rounded-full" />
                        Práctica de vocabulario activo
                      </li>
                    </ul>
                  </div>

                  <div class="space-y-3">
                    <h4 class="font-semibold text-[#FFAF54] flex items-center gap-2">
                      <Target class="w-4 h-4" />
                      Objetivos Semanales
                    </h4>
                    <ul class="space-y-2">
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#FFAF54] rounded-full" />
                        30 minutos de práctica diaria
                      </li>
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#FFAF54] rounded-full" />
                        Completar 5 actividades
                      </li>
                      <li class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="w-2 h-2 bg-[#FFAF54] rounded-full" />
                        Mejorar pronunciación 5%
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar' // composable provisto
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mic,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Volume2,
} from 'lucide-vue-next'

// UI base
import Avatar from '@/components/atoms/Avatar/Avatar.vue'
import AvatarFallback from '@/components/atoms/Avatar/AvatarFallback.vue'
import AvatarImage from '@/components/atoms/Avatar/AvatarImage.vue'
import Badge from '@/components/atoms/Badge.vue'
import Button from '@/components/atoms/Button.vue'
import Card from '@/components/molecules/Card/Card.vue'
import CardContent from '@/components/molecules/Card/CardContent.vue'
import CardHeader from '@/components/molecules/Card/CardHeader.vue'
import CardTitle from '@/components/molecules/Card/CardTitle.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/Tabs.ts'

// App components
import MetricCard from '@/components/MetricCard.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import VoiceActivityIndicator from '@/components/VoiceActivityIndicator.vue'
import GradientButton from '@/components/molecules/GradientButton.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'

interface Session {
  date: string
  duration: number
  score: number
  type: string
}
interface PronDetail {
  phoneme: string
  accuracy: number
  attempts: number
}
interface VoiceRec {
  id: string
  date: string
  duration: string
  topic: string
  score: number
}

interface Student {
  id: string
  name: string
  avatar?: string
  level: string
  oralPracticeHours: number
  fluencyScore: number
  pronunciationScore: number
  activitiesCompleted: number
  totalActivities: number
  lastActiveDate: string
  streak: number
  weeklyGoal: number
  recentSessions: Session[]
  strengths: string[]
  improvements: string[]
  pronunciationDetails: PronDetail[]
  voiceRecordings: VoiceRec[]
}

interface Props {
  student: Student
  onBack: () => void
}

const { isMobile } = useSidebar()

const { student, onBack } = defineProps<Props>()
const tab = ref<'overview' | 'voice' | 'progress' | 'recommendations'>('overview')

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'a1':
      return 'from-[#FBEB6F] to-[#FFAF54]'
    case 'a2':
      return 'from-[#FFAF54] to-[#FF6AAB]'
    case 'b1':
      return 'from-[#48D19C] to-[#9AD0F0]'
    case 'b2':
      return 'from-[#9AD0F0] to-[#967AFE]'
    default:
      return 'from-[#967AFE] to-[#48D19C]'
  }
}

const overallProgress = computed(() =>
  Math.round((student.fluencyScore + student.pronunciationScore) / 2),
)

function onPlay(): void {
  // reemplaza por tu manejador real
  // reproducir grabación (placeholder)
}
function onPause(): void {
  // pausar grabación (placeholder)
}
</script>

<style scoped>
/* Estilos adicionales si se requieren */
</style>
