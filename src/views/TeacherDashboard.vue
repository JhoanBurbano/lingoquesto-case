<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5]">
    <!-- Vista detalle -->
    <div v-if="selectedStudentData" class="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <StudentDetailView :student="selectedStudentData" :onBack="() => (selectedStudent = null)" />
    </div>

    <!-- Dashboard -->
    <div v-else>
      <DecorativePattern class="top-0 right-0 w-96 h-48" />

      <div class="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <!-- Header -->
        <div
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0 }"
          class="flex items-center justify-between mb-6 sm:mb-8"
        >
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="flex items-center gap-8 sm:gap-4">
              <LingoLogo class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              <div>
                <h1 class="font-sat-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900">
                  Dashboard del Profesor
                </h1>
                <p class="text-gray-600 text-xs sm:text-sm lg:text-base">
                  Gestión avanzada y análisis detallado de estudiantes
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-row-reverse sm:flex-row items-center gap-2 sm:gap-3">
            <LingoCharacter
              variant="happy"
              class="hidden sm:block w-8 h-8 sm:w-10 sm:h-10"
              :animated="false"
            />

            <!-- Support Link -->
            <router-link
              to="/support"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 hover:bg-purple-50 rounded-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="hidden sm:inline">Soporte</span>
            </router-link>

            <GradientButton variant="primary" size="sm">
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              <span class="hidden sm:inline">Nuevo Estudiante</span>
              <span class="sm:hidden">Nuevo</span>
            </GradientButton>
          </div>
        </div>

        <!-- Overview Metrics -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="0.1"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <MetricCard
            title="Estudiantes Totales"
            :value="metrics.totalStudents"
            icon="users"
            gradient="from-[#967AFE] to-[#48D19C]"
            context="registrados en tu clase"
            :showGradientAccent="true"
            :change="25"
          />

          <MetricCard
            title="Estudiantes Activos"
            :value="`${metrics.activeStudents}/${metrics.totalStudents}`"
            icon="users"
            gradient="from-[#48D19C] to-[#9AD0F0]"
            context="participación 100%"
            :showGradientAccent="true"
            :change="8"
          />

          <MetricCard
            title="Práctica Oral Promedio"
            :value="`${metrics.avgOralPractice}h`"
            icon="mic"
            gradient="from-[#FFAF54] to-[#FBEB6F]"
            context="por estudiante este mes"
            :showGradientAccent="true"
            :change="15"
          />

          <MetricCard
            title="Fluidez Promedio"
            :value="`${metrics.avgFluencyScore}%`"
            icon="target"
            gradient="from-[#967AFE] to-[#FFAF54]"
            context="nivel promedio"
            :showGradientAccent="true"
            :change="8"
          />
        </div>

        <!-- Filters -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          :delay="0.2"
          class="mb-6 sm:mb-8"
        >
          <StudentsFilters
            :filters="filters"
            :on-filters-change="handleFiltersChange"
            :total-students="metrics.totalStudents"
            :filtered-count="filteredStudents.length"
          />
        </div>

        <!-- Students Views -->
        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" :delay="0.3">
          <StudentsViews
            :students="filteredStudents"
            :viewMode="filters.viewMode"
            :onStudentClick="(id: string) => (selectedStudent = id)"
            :selectedStudent="selectedStudent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import StudentsFilters, { type FilterState } from './StudentsFilters.vue'
import StudentsViews from '@/views/StudentsViews.vue'
import StudentDetailView from './StudentDetailView.vue'
import MetricCard from '@/components/MetricCard.vue'
import LingoLogo from '@/components/atoms/LingoLogo.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import GradientButton from '@/components/molecules/GradientButton.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import { STUDENTS_DATA, calculateOverallMetrics } from '../data/students'
import { filterStudents, sortStudents } from '@/utils/studentsTools'

const selectedStudent = ref<string | null>(null)

const filters = reactive<FilterState>({
  searchQuery: '',
  level: [],
  progressRange: [0, 100],
  activityStatus: [],
  practiceHoursRange: [0, 30],
  streakRange: [0, 20],
  sortBy: 'name',
  sortOrder: 'asc',
  viewMode: 'grid',
  showOnlyActive: false,
  showOnlyNeedsAttention: false,
})

// Función para manejar cambios de filtros con reactividad garantizada
const handleFiltersChange = (newFilters: Partial<FilterState>) => {
  // Actualizar el objeto completo para garantizar reactividad
  Object.assign(filters, newFilters)
}

const selectedStudentData = computed(() =>
  selectedStudent.value
    ? (STUDENTS_DATA.find((s) => s.id === selectedStudent.value) ?? null)
    : null,
)

const filteredStudents = computed(() => {
  const filtered = filterStudents(STUDENTS_DATA, filters)
  return sortStudents(filtered, filters.sortBy, filters.sortOrder)
})

const metrics = computed(() => calculateOverallMetrics())
</script>

<style scoped>
/* Estilos específicos del componente si los necesitas */
</style>
