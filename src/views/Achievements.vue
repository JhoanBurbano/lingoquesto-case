<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import {
  Star,
  Crown,
  Award,
  Target,
  Calendar,
  Flame,
  Volume2,
  Mic,
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Search,
  CheckCircle,
} from 'lucide-vue-next'
import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import MetricCard from '@/components/MetricCard.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import { getStudentInitials } from '@/utils/studentsTools'

defineOptions({ name: 'AchievementsView' })

// Estado
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedStudent = ref('')
const activeTab = ref('ranking')
const isAssignBadgeOpen = ref(false)
const selectedStudentForBadge = ref('')
const selectedBadgeForAssignment = ref('')

// Tabs
const tabs = [
  { id: 'ranking', name: 'Ranking' },
  { id: 'badges', name: 'Insignias' },
  { id: 'students', name: 'Por Estudiante' },
  { id: 'teacher', name: 'Logros Profesor' },
]

// Badges disponibles
const badges = [
  {
    id: 'first-conversation',
    name: 'Primera Conversación',
    description: 'Completó su primera práctica de conversación',
    icon: Mic,
    gradient: 'from-[#967AFE] to-[#48D19C]',
    category: 'oral',
    rarity: 'common',
  },
  {
    id: 'pronunciation-master',
    name: 'Dominio de Audio',
    description: 'Logró 95% de precisión en pronunciación',
    icon: Volume2,
    gradient: 'from-[#FFAF54] to-[#FBEB6F]',
    category: 'oral',
    rarity: 'epic',
  },
  {
    id: 'streak-warrior',
    name: 'Racha Activa',
    description: 'Mantuvo una racha de 30 días consecutivos',
    icon: Flame,
    gradient: 'from-[#FF6AAB] to-[#FFAF54]',
    category: 'participation',
    rarity: 'rare',
  },
  {
    id: 'progress-champion',
    name: 'Progreso Constante',
    description: 'Mejoró su fluidez en un 50% este mes',
    icon: TrendingUp,
    gradient: 'from-[#48D19C] to-[#9AD0F0]',
    category: 'progress',
    rarity: 'rare',
  },
  {
    id: 'bookworm',
    name: 'Contenido de Lectura',
    description: 'Completó 100 actividades de lectura',
    icon: BookOpen,
    gradient: 'from-[#9AD0F0] to-[#967AFE]',
    category: 'progress',
    rarity: 'common',
  },
  {
    id: 'conversation-king',
    name: 'Rey del Aprendizaje',
    description: 'Completó 50 sesiones de práctica oral',
    icon: Crown,
    gradient: 'from-[#FBEB6F] to-[#FFAF54]',
    category: 'oral',
    rarity: 'legendary',
  },
  {
    id: 'perfect-attendance',
    name: 'Asistencia Perfecta',
    description: 'No faltó a ninguna clase este mes',
    icon: Calendar,
    gradient: 'from-[#967AFE] to-[#FFAF54]',
    category: 'participation',
    rarity: 'rare',
  },
  {
    id: 'student-of-month',
    name: 'Estrella del Mes',
    description: 'El mejor estudiante del mes',
    icon: Star,
    gradient: 'from-[#FFD700] to-[#FFA500]',
    category: 'special',
    rarity: 'legendary',
  },
]

// Logros de estudiantes
const studentAchievements = ref([
  {
    studentId: '1',
    studentName: 'María García',
    level: 'B2',
    points: 2450,
    totalBadges: 8,
    badges: [
      {
        badgeId: 'first-conversation',
        earnedDate: '2024-01-15',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'pronunciation-master',
        earnedDate: '2024-02-20',
        assignedBy: 'Profesor',
      },
      {
        badgeId: 'streak-warrior',
        earnedDate: '2024-02-28',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'student-of-month',
        earnedDate: '2024-02-01',
        assignedBy: 'Profesor',
      },
      {
        badgeId: 'progress-champion',
        earnedDate: '2024-02-25',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'bookworm',
        earnedDate: '2024-02-15',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'conversation-king',
        earnedDate: '2024-03-01',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'perfect-attendance',
        earnedDate: '2024-02-29',
        assignedBy: 'Profesor',
      },
    ],
  },
  {
    studentId: '2',
    studentName: 'Carlos Rodríguez',
    level: 'B1',
    points: 1820,
    totalBadges: 6,
    badges: [
      {
        badgeId: 'first-conversation',
        earnedDate: '2024-01-20',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'streak-warrior',
        earnedDate: '2024-02-15',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'progress-champion',
        earnedDate: '2024-02-18',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'bookworm',
        earnedDate: '2024-02-10',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'perfect-attendance',
        earnedDate: '2024-01-31',
        assignedBy: 'Profesor',
      },
      {
        badgeId: 'pronunciation-master',
        earnedDate: '2024-02-22',
        assignedBy: 'Profesor',
      },
    ],
  },
  {
    studentId: '3',
    studentName: 'Ana López',
    level: 'A2',
    points: 1340,
    totalBadges: 4,
    badges: [
      {
        badgeId: 'first-conversation',
        earnedDate: '2024-02-01',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'bookworm',
        earnedDate: '2024-02-20',
        assignedBy: 'Auto',
      },
      {
        badgeId: 'perfect-attendance',
        earnedDate: '2024-02-29',
        assignedBy: 'Profesor',
      },
      {
        badgeId: 'progress-champion',
        earnedDate: '2024-02-25',
        assignedBy: 'Auto',
      },
    ],
  },
])

// Logros del profesor
const teacherAchievements = [
  {
    id: 'first-student',
    name: 'Primer Estudiante',
    description: 'Tuviste tu primer estudiante en la plataforma',
    icon: Users,
    progress: 1,
    target: 1,
    gradient: 'from-[#967AFE] to-[#48D19C]',
    completed: true,
  },
  {
    id: 'active-teacher',
    name: 'Profesor Activo',
    description: 'Mantén 10 estudiantes activos por 30 días',
    icon: TrendingUp,
    progress: 8,
    target: 10,
    gradient: 'from-[#FFAF54] to-[#FBEB6F]',
    completed: false,
  },
  {
    id: 'badge-master',
    name: 'Maestro de Badges',
    description: 'Asigna 50 badges a tus estudiantes',
    icon: Award,
    progress: 32,
    target: 50,
    gradient: 'from-[#FF6AAB] to-[#FFAF54]',
    completed: false,
  },
  {
    id: 'student-success',
    name: 'Éxito Estudiantil',
    description: 'Ayuda a 5 estudiantes a alcanzar el nivel B2',
    icon: Target,
    progress: 3,
    target: 5,
    gradient: 'from-[#48D19C] to-[#9AD0F0]',
    completed: false,
  },
]

// Computed
const sortedStudents = computed(() => {
  return [...studentAchievements.value].sort((a, b) => b.points - a.points)
})

const filteredBadges = computed(() => {
  let filtered = badges

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((badge) => badge.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (badge) =>
        badge.name.toLowerCase().includes(query) || badge.description.toLowerCase().includes(query),
    )
  }

  return filtered
})

const filteredStudents = computed(() => {
  let filtered = studentAchievements.value

  if (selectedStudent.value) {
    filtered = filtered.filter((student) => student.studentId === selectedStudent.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((student) => student.studentName.toLowerCase().includes(query))
  }

  return filtered
})

// Métodos
const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return { bg: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]' }
    case 2:
      return { bg: 'bg-gradient-to-r from-[#C0C0C0] to-[#A9A9A9]' }
    case 3:
      return { bg: 'bg-gradient-to-r from-[#CD7F32] to-[#B8860B]' }
    default:
      return { bg: 'bg-gradient-to-r from-[#967AFE] to-[#48D19C]' }
  }
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return {
        bg: 'bg-blue-100',
        text: 'text-gray-800',
        label: 'Común',
        border: 'border-blue-200',
      }
    case 'rare':
      return {
        bg: 'bg-gradient-to-br from-pink-400 to-red-400',
        text: 'text-white',
        label: 'Raro',
        border: 'border-transparent',
      }
    case 'epic':
      return {
        bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
        text: 'text-white',
        label: 'Épico',
        border: 'border-transparent',
      }
    case 'legendary':
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        text: 'text-white',
        label: 'Legendario',
        border: 'border-transparent',
        glow: 'shadow-lg shadow-yellow-400/50',
      }
    default:
      return {
        bg: 'bg-blue-100',
        text: 'text-gray-800',
        label: 'Común',
        border: 'border-blue-200',
      }
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'A1':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
    case 'A2':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
    case 'B1':
      return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' }
    case 'B2':
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  }
}

const getBadgeById = (id: string) => {
  return badges.find((badge) => badge.id === id)
}

// const formatDate = (date: string) => {
//   return new Date(date).toLocaleDateString('es-ES', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   })
// }

const assignBadge = (badge: { id: string }) => {
  selectedBadgeForAssignment.value = badge.id
  isAssignBadgeOpen.value = true
}

const confirmAssignBadge = () => {
  if (selectedStudentForBadge.value && selectedBadgeForAssignment.value) {
    // Aquí se implementaría la lógica para asignar el badge
    const student = studentAchievements.value.find(
      (s) => s.studentId === selectedStudentForBadge.value,
    )
    const badge = badges.find((b) => b.id === selectedBadgeForAssignment.value)

    if (student && badge) {
      // Agregar el badge al estudiante
      student.badges.push({
        badgeId: badge.id,
        earnedDate: new Date().toISOString().split('T')[0],
        assignedBy: 'Profesor',
      })
      student.totalBadges++

      toast.success(`Insignia "${badge.name}" asignada a ${student.studentName}`)
    }

    isAssignBadgeOpen.value = false
    selectedStudentForBadge.value = ''
    selectedBadgeForAssignment.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F9F6FF] to-[#E8F8F5] relative overflow-hidden">
    <DecorativePattern class="top-0 right-0 w-96 h-48" />

    <div class="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <LingoCharacter variant="celebrating" class="w-12 h-12" :animated="true" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 font-['Satoshi',sans-serif]">
              Sistema de Logros
            </h1>
            <p class="text-gray-600">Gestiona insignias y celebra el progreso de tus estudiantes</p>
          </div>
        </div>

        <Button
          @click="isAssignBadgeOpen = true"
          class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white hover:opacity-90 z-10"
        >
          <Plus class="w-4 h-4 mr-2" />
          Asignar Insignia
        </Button>
      </div>

      <!-- Métricas principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="INSIGNIAS ASIGNADAS"
          value="127"
          icon="award"
          gradient="from-[#967AFE] to-[#48D19C]"
          context="este mes"
          description="Total de insignias otorgadas"
          :change="15"
          changeLabel="vs. mes anterior"
        />
        <MetricCard
          title="ESTUDIANTES ACTIVOS"
          value="12/12"
          icon="users"
          gradient="from-[#48D19C] to-[#9AD0F0]"
          context="participación 100%"
          description="Todos los estudiantes participando"
          :change="0"
          changeLabel="vs. mes anterior"
        />
        <MetricCard
          title="PROMEDIO PUNTOS"
          value="1,537"
          icon="target"
          gradient="from-[#FFAF54] to-[#FBEB6F]"
          context="vs mes anterior"
          :change="22"
          changeLabel="mejora mensual"
        />
        <MetricCard
          title="TUS LOGROS"
          value="2/4"
          icon="trophy"
          gradient="from-[#FF6AAB] to-[#FFAF54]"
          context="completados"
          description="Logros como profesor"
          :change="0"
          changeLabel="progreso"
        />
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <div class="flex-1 w-full lg:w-auto">
            <div class="relative">
              <Search
                class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar estudiantes o badges..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <select
              v-model="selectedCategory"
              class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
            >
              <option value="all">Todas las categorías</option>
              <option value="oral">Práctica Oral</option>
              <option value="progress">Progreso</option>
              <option value="participation">Participación</option>
              <option value="special">Especiales</option>
            </select>

            <select
              v-model="selectedStudent"
              class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
            >
              <option value="">Todos los estudiantes</option>
              <option
                v-for="student in studentAchievements"
                :key="student.studentId"
                :value="student.studentId"
              >
                {{ student.studentName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabs principales -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === tab.id
                  ? 'border-b-4 border-transparent bg-gradient-to-r from-[#967AFE] to-[#48D19C] bg-clip-text text-transparent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Contenido de tabs -->
        <div class="p-6">
          <!-- Tab: Ranking -->
          <div v-if="activeTab === 'ranking'" class="space-y-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Ranking de Estudiantes</h3>

            <!-- Podium de Estudiantes -->
            <div class="flex flex-row justify-center items-end gap-6 sm:gap-8 mb-8 relative z-10">
              <!-- Segundo Lugar (Left) -->
              <div class="flex flex-col items-center sm:order-1">
                <div class="relative">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2">
                    <Avatar
                      class="w-full h-full border-4 border-white shadow-lg rounded-full flex justify-center items-center"
                    >
                      <AvatarFallback
                        class="bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold w-full h-full rounded-full flex items-center justify-center"
                      >
                        CR
                      </AvatarFallback>
                    </Avatar>
                    <div class="absolute -top-2 -right-2">
                      <Medal class="w-5 h-5 text-[#C0C0C0]" />
                    </div>
                  </div>

                  <div class="text-center">
                    <h4 class="font-semibold text-gray-900">Carlos Rodríguez</h4>
                    <Badge
                      class="bg-gradient-to-r from-green-400 to-teal-500 text-white border-0 mb-1"
                    >
                      B1
                    </Badge>
                    <div class="text-sm text-gray-600">1820 pts</div>
                    <div class="text-xs text-[#967AFE] font-semibold">6 insignias</div>
                  </div>

                  <div
                    class="bg-gradient-to-t from-[#C0C0C0] to-[#E8E8E8] h-16 sm:h-20 w-full rounded-t-lg mt-2 flex items-center justify-center text-white font-bold"
                  >
                    #2
                  </div>
                </div>
              </div>

              <!-- Primer Lugar (Center) -->
              <div class="flex flex-col items-center sm:order-2">
                <div class="relative">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                    <Avatar
                      class="w-full h-full border-4 border-white shadow-lg rounded-full flex justify-center items-center"
                    >
                      <AvatarFallback
                        class="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold w-full h-full rounded-full flex items-center justify-center"
                      >
                        MG
                      </AvatarFallback>
                    </Avatar>
                    <div class="absolute -top-2 -right-2">
                      <Crown class="w-6 h-6 text-[#FFD700]" />
                    </div>
                  </div>

                  <div class="text-center">
                    <h4 class="font-semibold text-gray-900">María García</h4>
                    <Badge
                      class="bg-gradient-to-r from-blue-400 to-purple-500 text-white border-0 mb-1"
                    >
                      B2
                    </Badge>
                    <div class="text-sm text-gray-600">2450 pts</div>
                    <div class="text-xs text-[#967AFE] font-semibold">8 insignias</div>
                  </div>

                  <div
                    class="bg-gradient-to-t from-[#FFD700] to-[#FFA500] h-20 sm:h-28 w-full rounded-t-lg mt-2 flex items-center justify-center text-white font-bold"
                  >
                    #1
                  </div>
                </div>
              </div>

              <!-- Tercer Lugar (Right) -->
              <div class="flex flex-col items-center sm:order-3">
                <div class="relative">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2">
                    <Avatar
                      class="w-full h-full border-4 border-white shadow-lg rounded-full flex justify-center items-center"
                    >
                      <AvatarFallback
                        class="bg-gradient-to-br from-pink-400 to-orange-500 text-white font-bold w-full h-full rounded-full flex items-center justify-center"
                      >
                        AL
                      </AvatarFallback>
                    </Avatar>
                    <div class="absolute -top-2 -right-2">
                      <Medal class="w-5 h-5 text-[#CD7F32]" />
                    </div>
                  </div>

                  <div class="text-center">
                    <h4 class="font-semibold text-gray-900">Ana López</h4>
                    <Badge
                      class="bg-gradient-to-r from-pink-400 to-orange-500 text-white border-0 mb-1"
                    >
                      A2
                    </Badge>
                    <div class="text-sm text-gray-600">1340 pts</div>
                    <div class="text-xs text-[#967AFE] font-semibold">4 insignias</div>
                  </div>

                  <div
                    class="bg-gradient-to-t from-[#CD7F32] to-[#D2B48C] h-12 sm:h-16 w-full rounded-t-lg mt-2 flex items-center justify-center text-white font-bold"
                  >
                    #3
                  </div>
                </div>
              </div>
            </div>

            <!-- Ranking Completo -->
            <div class="space-y-3 relative z-0">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Ranking Completo</h4>
              <div
                v-for="(student, index) in sortedStudents"
                :key="student.studentId"
                class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    :class="getRankColor(index + 1).bg"
                  >
                    {{ index + 1 }}
                  </div>
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold"
                  >
                    {{ getStudentInitials(student.studentName) }}
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-900">{{ student.studentName }}</h5>
                    <div class="flex items-center gap-2 mt-1">
                      <Badge
                        :class="
                          getLevelColor(student.level).bg + ' ' + getLevelColor(student.level).text
                        "
                      >
                        {{ student.level }}
                      </Badge>
                      <span class="text-sm text-gray-600">{{ student.totalBadges }} insignias</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-[#967AFE]">{{ student.points }}</div>
                  <div class="text-sm text-gray-600">puntos</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Badges Disponibles -->
          <div v-if="activeTab === 'badges'" class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Catálogo de Insignias</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="badge in filteredBadges"
                :key="badge.id"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    :class="`bg-gradient-to-r ${badge.gradient}`"
                  >
                    <component :is="badge.icon" class="w-6 h-6" />
                  </div>
                  <Badge
                    :class="
                      [
                        getRarityColor(badge.rarity).bg,
                        getRarityColor(badge.rarity).text,
                        getRarityColor(badge.rarity).border || '',
                        getRarityColor(badge.rarity).glow || '',
                      ].join(' ')
                    "
                  >
                    {{ getRarityColor(badge.rarity).label }}
                  </Badge>
                </div>

                <h4 class="font-semibold text-gray-900 mb-2">{{ badge.name }}</h4>
                <p class="text-sm text-gray-600 mb-4">{{ badge.description }}</p>

                <div class="flex items-center justify-between">
                  <Badge class="bg-gray-100 text-gray-700">
                    {{ badge.category }}
                  </Badge>
                  <Button
                    size="sm"
                    @click="assignBadge(badge)"
                    class="bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white hover:opacity-90"
                  >
                    Asignar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Estudiantes -->
          <div v-if="activeTab === 'students'" class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Logros por Estudiante</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="student in filteredStudents"
                :key="student.studentId"
                class="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <!-- Header del estudiante -->
                <div class="p-6 border-b border-gray-100">
                  <div class="flex items-center gap-4 mb-4">
                    <div
                      class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      :class="getLevelColor(student.level).bg"
                    >
                      {{ getStudentInitials(student.studentName) }}
                    </div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900">{{ student.studentName }}</h4>
                      <div class="flex items-center gap-2 mt-1">
                        <Badge
                          :class="
                            [
                              getLevelColor(student.level).bg,
                              getLevelColor(student.level).text,
                              getLevelColor(student.level).border,
                            ].join(' ')
                          "
                        >
                          {{ student.level }}
                        </Badge>
                        <span class="text-sm text-gray-600">{{ student.points }} pts</span>
                      </div>
                    </div>
                  </div>

                  <!-- Total de insignias -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Total insignias:</span>
                    <Badge
                      class="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-3 py-1"
                    >
                      {{ student.totalBadges }}
                    </Badge>
                  </div>
                </div>

                <!-- Insignias del estudiante con nuevo diseño -->
                <div class="p-6">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      v-for="badge in student.badges"
                      :key="badge.badgeId"
                      class="flex flex-col items-center text-center"
                    >
                      <div
                        class="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-2"
                        :class="
                          [
                            getRarityColor(getBadgeById(badge.badgeId)?.rarity || 'common').bg,
                            getRarityColor(getBadgeById(badge.badgeId)?.rarity || 'common')
                              .border || '',
                            getRarityColor(getBadgeById(badge.badgeId)?.rarity || 'common').glow ||
                              '',
                          ].join(' ')
                        "
                      >
                        <component
                          :is="getBadgeById(badge.badgeId)?.icon || Award"
                          class="w-6 h-6"
                        />
                      </div>
                      <div class="text-xs font-medium text-gray-700 text-center leading-tight">
                        {{ getRarityColor(getBadgeById(badge.badgeId)?.rarity || 'common').label }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Logros del Profesor -->
          <div v-if="activeTab === 'teacher'" class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Mis Logros como Profesor</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="achievement in teacherAchievements"
                :key="achievement.id"
                class="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    :class="`bg-gradient-to-r ${achievement.gradient}`"
                  >
                    <component :is="achievement.icon" class="w-6 h-6" />
                  </div>
                  <div
                    v-if="achievement.completed"
                    class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle class="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <h4 class="font-semibold text-gray-900 mb-2">{{ achievement.name }}</h4>
                <p class="text-sm text-gray-600 mb-4">{{ achievement.description }}</p>

                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Progreso</span>
                    <span class="font-medium"
                      >{{ achievement.progress }}/{{ achievement.target }}</span
                    >
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="achievement.completed ? 'bg-green-500' : 'bg-[#967AFE]'"
                      :style="{
                        width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`,
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para asignar badge -->
    <div
      v-if="isAssignBadgeOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="isAssignBadgeOpen = false"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Asignar Insignia</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estudiante</label>
            <select
              v-model="selectedStudentForBadge"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
            >
              <option value="">Seleccionar estudiante</option>
              <option
                v-for="student in studentAchievements"
                :key="student.studentId"
                :value="student.studentId"
              >
                {{ student.studentName }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Insignia</label>
            <select
              v-model="selectedBadgeForAssignment"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
            >
              <option value="">Seleccionar insignia</option>
              <option v-for="badge in badges" :key="badge.id" :value="badge.id">
                {{ badge.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <Button @click="isAssignBadgeOpen = false" variant="outline" class="flex-1">
            Cancelar
          </Button>
          <Button
            @click="confirmAssignBadge"
            :disabled="!selectedStudentForBadge || !selectedBadgeForAssignment"
            class="flex-1 bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white hover:opacity-90"
          >
            Asignar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
