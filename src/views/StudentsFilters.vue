<template>
  <div class="space-y-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <!-- Header con conteo de resultados -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Users class="w-5 h-5 text-[#967AFE]" />
        <div>
          <h3 class="font-['Satoshi',sans-serif] font-semibold text-gray-900">
            Gestión de Estudiantes
          </h3>
          <p class="text-sm text-gray-600">
            Mostrando {{ filteredCount }} de {{ totalStudents }} estudiantes
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Badge
          v-if="activeFiltersCount > 0"
          class="bg-[#967AFE]/10 text-[#967AFE] border-[#967AFE]/20"
        >
          {{ activeFiltersCount }} filtros activos
        </Badge>
        <Button variant="outline" size="sm" class="flex items-center gap-2" @click="resetFilters">
          <RotateCcw class="w-4 h-4" />
          Limpiar
        </Button>
      </div>
    </div>

    <!-- Búsqueda y filtros rápidos -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Buscador -->
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          :value="filters.searchQuery"
          @input="onSearchInput"
          placeholder="Buscar por nombre, email o ID..."
          class="pl-10 bg-input-background border-0 rounded-xl focus:ring-2 focus:ring-[#967AFE]/20 focus:border-[#967AFE]"
        />
      </div>

      <!-- Filtros rápidos -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Niveles -->
        <Button
          v-for="lvl in LEVELS"
          :key="lvl"
          :variant="filters.level.includes(lvl) ? 'default' : 'outline'"
          size="sm"
          @click="toggleLevel(lvl)"
          :class="[
            'rounded-xl',
            filters.level.includes(lvl)
              ? 'bg-gradient-to-r from-[#967AFE] to-[#48D19C] text-white border-0'
              : 'border-gray-200 hover:border-[#967AFE]/50',
          ]"
        >
          {{ lvl }}
        </Button>

        <!-- Estados de actividad -->
        <Button
          :variant="filters.showOnlyActive ? 'default' : 'outline'"
          size="sm"
          @click="updateFilter('showOnlyActive', !filters.showOnlyActive)"
          :class="[
            'rounded-xl flex items-center gap-2',
            filters.showOnlyActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
              : 'border-gray-200 hover:border-green-500/50',
          ]"
        >
          <Zap class="w-3 h-3" />
          Activos
        </Button>

        <Button
          :variant="filters.showOnlyNeedsAttention ? 'default' : 'outline'"
          size="sm"
          @click="updateFilter('showOnlyNeedsAttention', !filters.showOnlyNeedsAttention)"
          :class="[
            'rounded-xl flex items-center gap-2',
            filters.showOnlyNeedsAttention
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-0'
              : 'border-gray-200 hover:border-red-500/50',
          ]"
        >
          <TrendingUp class="w-3 h-3" />
          Necesitan Atención
        </Button>
      </div>
    </div>

    <!-- Filtros avanzados + controles de orden y vista -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-center gap-4">
        <!-- Popover filtros avanzados -->
        <Popover v-model:open="isAdvancedOpen">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              size="sm"
              class="flex items-center gap-2 rounded-xl border-gray-200"
            >
              <SlidersHorizontal class="w-4 h-4" />
              Filtros Avanzados
              <ChevronDown
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-180': isAdvancedOpen }"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80 p-6 rounded-xl" align="start">
            <div class="space-y-6">
              <div>
                <h4 class="font-['Satoshi',sans-serif] font-semibold text-gray-900 mb-3">
                  Filtros Avanzados
                </h4>
              </div>

              <!-- Rango de progreso -->
              <div class="space-y-3">
                <Label class="font-['Satoshi',sans-serif] font-medium">
                  Rango de Progreso: {{ filters.progressRange[0] }}% -
                  {{ filters.progressRange[1] }}%
                </Label>
                <Slider
                  :model-value="filters.progressRange"
                  @update:model-value="
                    (v: number[] | undefined) =>
                      v && updateFilter('progressRange', v as [number, number])
                  "
                  :max="100"
                  :min="0"
                  :step="5"
                  class="w-full"
                />
              </div>

              <Separator />

              <!-- Horas de práctica -->
              <div class="space-y-3">
                <Label class="font-['Satoshi',sans-serif] font-medium">
                  Horas de Práctica: {{ filters.practiceHoursRange[0] }}h -
                  {{ filters.practiceHoursRange[1] }}h
                </Label>
                <Slider
                  :model-value="filters.practiceHoursRange"
                  @update:model-value="
                    (v: number[] | undefined) =>
                      v && updateFilter('practiceHoursRange', v as [number, number])
                  "
                  :max="30"
                  :min="0"
                  :step="1"
                  class="w-full"
                />
              </div>

              <Separator />

              <!-- Racha -->
              <div class="space-y-3">
                <Label class="font-['Satoshi',sans-serif] font-medium">
                  Racha (días): {{ filters.streakRange[0] }} - {{ filters.streakRange[1] }}
                </Label>
                <Slider
                  :model-value="filters.streakRange"
                  @update:model-value="
                    (v: number[] | undefined) =>
                      v && updateFilter('streakRange', v as [number, number])
                  "
                  :max="20"
                  :min="0"
                  :step="1"
                  class="w-full"
                />
              </div>

              <Separator />

              <!-- Estado de actividad detallado -->
              <div class="space-y-3">
                <Label class="font-['Satoshi',sans-serif] font-medium">Estado de Actividad</Label>
                <div class="grid grid-cols-2 gap-2">
                  <Button
                    v-for="item in ACTIVITY_OPTIONS"
                    :key="item.value"
                    :variant="filters.activityStatus.includes(item.value) ? 'default' : 'outline'"
                    size="sm"
                    @click="toggleActivity(item.value)"
                    :class="[
                      'justify-start rounded-lg',
                      filters.activityStatus.includes(item.value)
                        ? 'bg-[#967AFE] text-white'
                        : 'border-gray-200',
                    ]"
                  >
                    <component :is="item.icon" class="w-3 h-3 mr-2" />
                    {{ item.label }}
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <!-- Orden -->
        <Select
          :model-value="filters.sortBy"
          @update:model-value="(v: unknown) => updateFilter('sortBy', v as string)"
        >
          <SelectTrigger class="w-48 rounded-xl border-gray-200">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent class="rounded-xl">
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="progress">Progreso</SelectItem>
            <SelectItem value="practiceHours">Horas de Práctica</SelectItem>
            <SelectItem value="lastActive">Última Actividad</SelectItem>
            <SelectItem value="streak">Racha</SelectItem>
            <SelectItem value="level">Nivel</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          class="rounded-xl border-gray-200"
          @click="toggleSortOrder"
        >
          {{ filters.sortOrder === 'asc' ? '↑' : '↓' }}
        </Button>
      </div>

      <!-- Modos de vista -->
      <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <Button
          v-for="vm in VIEW_MODES"
          :key="vm.mode"
          :variant="filters.viewMode === vm.mode ? 'default' : 'ghost'"
          size="sm"
          @click="updateFilter('viewMode', vm.mode)"
          :title="vm.label"
          :class="[
            'rounded-lg',
            filters.viewMode === vm.mode
              ? 'bg-white shadow-sm text-[#967AFE]'
              : 'text-gray-600 hover:text-gray-900',
          ]"
        >
          <component :is="vm.icon" class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Chips de filtros activos -->
    <Transition name="fade-slide">
      <div v-if="hasTagFilters" class="flex flex-wrap gap-2">
        <span class="text-sm text-gray-600 font-['Satoshi',sans-serif] font-medium"
          >Filtros activos:</span
        >

        <!-- Filtros por nivel -->
        <Badge
          v-for="lvl in filters.level"
          :key="lvl"
          class="bg-gradient-to-r from-[#967AFE]/10 to-[#48D19C]/10 text-[#967AFE] border border-[#967AFE]/20 hover:bg-[#967AFE]/20 cursor-pointer"
          @click="removeLevel(lvl)"
        >
          Nivel {{ lvl }}
          <X class="w-3 h-3 ml-1" />
        </Badge>

        <!-- Filtros por actividad -->
        <Badge
          v-for="st in filters.activityStatus"
          :key="st"
          class="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer"
          @click="removeActivity(st)"
        >
          {{ activityLabel(st) }}
          <X class="w-3 h-3 ml-1" />
        </Badge>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Search,
  X,
  ChevronDown,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Zap,
  RotateCcw,
  Grid3X3,
  List,
  Table,
  SlidersHorizontal,
} from 'lucide-vue-next'

// UI components (ajusta las rutas a tu lib de UI)
import Input from '@/components/atoms/Input.vue'
import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import Slider from '@/components/atoms/Slider.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components'
import Separator from '@/components/atoms/Separator.vue'
import Label from '@/components/atoms/Label.vue'

// Tipos (exportado para reutilizar desde el padre)
export interface FilterState {
  searchQuery: string
  level: string[]
  progressRange: [number, number]
  activityStatus: string[]
  practiceHoursRange: [number, number]
  streakRange: [number, number]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  viewMode: 'grid' | 'list' | 'table'
  showOnlyActive: boolean
  showOnlyNeedsAttention: boolean
}

interface Props {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  totalStudents: number
  filteredCount: number
}

const props = defineProps<Props>()

// Estado local
const isAdvancedOpen = ref(false)

// Constantes UI
const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const
const ACTIVITY_OPTIONS = [
  { value: 'recent', label: 'Reciente', icon: Clock },
  { value: 'today', label: 'Hoy', icon: Calendar },
  { value: 'week', label: 'Esta semana', icon: TrendingUp },
  { value: 'inactive', label: 'Inactivo', icon: X },
] as const

const VIEW_MODES = [
  { mode: 'grid' as const, icon: Grid3X3, label: 'Tarjetas' },
  { mode: 'list' as const, icon: List, label: 'Lista' },
  { mode: 'table' as const, icon: Table, label: 'Tabla' },
]

// Helpers
const updateFilter = (key: keyof FilterState, value: unknown) => {
  props.onFiltersChange({ [key]: value })
}

const resetFilters = () => {
  props.onFiltersChange({
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
}

const toggleLevel = (level: string) => {
  if (props.filters.level.includes(level)) {
    updateFilter(
      'level',
      props.filters.level.filter((l) => l !== level),
    )
  } else {
    updateFilter('level', [...props.filters.level, level])
  }
}

const removeLevel = (level: string) => {
  updateFilter(
    'level',
    props.filters.level.filter((l) => l !== level),
  )
}

const toggleActivity = (status: string) => {
  if (props.filters.activityStatus.includes(status)) {
    updateFilter(
      'activityStatus',
      props.filters.activityStatus.filter((s) => s !== status),
    )
  } else {
    updateFilter('activityStatus', [...props.filters.activityStatus, status])
  }
}

const removeActivity = (status: string) => {
  updateFilter(
    'activityStatus',
    props.filters.activityStatus.filter((s) => s !== status),
  )
}

const toggleSortOrder = () => {
  updateFilter('sortOrder', props.filters.sortOrder === 'asc' ? 'desc' : 'asc')
}

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  updateFilter('searchQuery', target?.value ?? '')
}

const activeFiltersCount = computed(() => {
  const f = props.filters
  return (
    f.level.length +
    f.activityStatus.length +
    (f.showOnlyActive ? 1 : 0) +
    (f.showOnlyNeedsAttention ? 1 : 0) +
    (f.progressRange[0] !== 0 || f.progressRange[1] !== 100 ? 1 : 0) +
    (f.practiceHoursRange[0] !== 0 || f.practiceHoursRange[1] !== 30 ? 1 : 0) +
    (f.streakRange[0] !== 0 || f.streakRange[1] !== 20 ? 1 : 0)
  )
})

const hasTagFilters = computed(
  () => props.filters.level.length > 0 || props.filters.activityStatus.length > 0,
)

const activityLabel = (status: string) => {
  switch (status) {
    case 'recent':
      return 'Reciente'
    case 'today':
      return 'Hoy'
    case 'week':
      return 'Esta semana'
    case 'inactive':
      return 'Inactivo'
    default:
      return status
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
