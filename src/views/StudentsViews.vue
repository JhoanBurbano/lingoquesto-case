<script setup lang="ts">
import { Users, Mic, Zap, Clock } from 'lucide-vue-next'
import Badge from '@/components/atoms/Badge.vue'
import type { Student } from '@/data/students'
import {
  getProgressStatus,
  getActivityStatus,
  getLevelColor,
  getStudentInitials,
  formatLastActive,
} from '@/utils/studentsTools'
import ProgressRing from '@/components/ProgressRing.vue'

interface Props {
  students: Student[]
  viewMode: 'grid' | 'list' | 'table'
  onStudentClick: (id: string) => void
  selectedStudent: string | null
}

defineProps<Props>()
defineOptions({ name: 'StudentsViews' })
</script>

<template>
  <section class="space-y-6">
    <!-- Vista Grid -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="student in students"
        :key="student.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-200 cursor-pointer"
        :class="{ 'ring-2 ring-[#967AFE]': selectedStudent === student.id }"
        @click="onStudentClick(student.id)"
      >
        <!-- Header con avatar, nombre y estado -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative">
              <div
                class="w-12 h-12 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold text-lg"
              >
                {{ getStudentInitials(student.name) }}
              </div>
              <span
                class="absolute -bottom-0 -right-0 w-3 h-3 rounded-full ring-2 ring-white"
                :class="getActivityStatus(student.lastActiveDate).color"
              />
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ student.name }}</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <Badge
                  :class="getLevelColor(student.level).bg + ' ' + getLevelColor(student.level).text"
                >
                  {{ student.level }}
                </Badge>
                <span class="text-xs text-gray-500">{{
                  getActivityStatus(student.lastActiveDate).label
                }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="getProgressStatus(student.fluencyScore).status === 'needs-attention'"
            class="ml-2"
          >
            <Badge class="bg-red-100 text-red-700 border-red-200">Necesita Atención</Badge>
          </div>
        </div>

        <!-- Anillos de progreso -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="flex flex-col items-center gap-1">
            <ProgressRing :progress="student.fluencyScore" :size="56" :stroke-width="5" />
            <span class="text-xs text-gray-500">Fluidez</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ProgressRing
              :progress="Math.round((student.activitiesCompleted / student.totalActivities) * 100)"
              :size="56"
              :stroke-width="5"
            />
            <span class="text-xs text-gray-500">Actividades</span>
          </div>
        </div>

        <!-- Métricas principales -->
        <div class="space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-gray-600">
              <Mic class="w-4 h-4" />
              <span>Práctica Oral</span>
            </div>
            <span class="font-semibold text-gray-900">{{ student.oralPracticeHours }}h</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-gray-600">
              <Zap class="w-4 h-4" />
              <span>Racha</span>
            </div>
            <span class="font-semibold text-orange-600">{{ student.streak }} días</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-gray-600">
              <Clock class="w-4 h-4" />
              <span>Última actividad</span>
            </div>
            <span class="font-semibold text-gray-900">{{
              formatLastActive(student.lastActiveDate)
            }}</span>
          </div>
        </div>

        <hr class="my-3 border-gray-100" />

        <!-- Meta semanal -->
        <div>
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-600">Meta semanal</span>
            <span class="font-semibold text-gray-900"
              >{{ student.oralPracticeHours }}h/{{ student.weeklyGoal }}h</span
            >
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-2 bg-gradient-to-r from-[#967AFE] to-[#48D19C] rounded-full"
              :style="{
                width: `${Math.min(100, Math.round((student.oralPracticeHours / Math.max(1, student.weeklyGoal)) * 100))}%`,
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Lista -->
    <div v-else-if="viewMode === 'list'" class="space-y-3">
      <div
        v-for="student in students"
        :key="student.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
        :class="{ 'ring-2 ring-[#967AFE] bg-[#967AFE]/5': selectedStudent === student.id }"
        @click="onStudentClick(student.id)"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold"
          >
            {{ getStudentInitials(student.name) }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <h3 class="font-semibold text-gray-900">{{ student.name }}</h3>
              <Badge
                :class="getLevelColor(student.level).bg + ' ' + getLevelColor(student.level).text"
              >
                {{ student.level }}
              </Badge>
              <div
                class="w-2 h-2 rounded-full"
                :class="getActivityStatus(student.lastActiveDate).color"
                :title="getActivityStatus(student.lastActiveDate).label"
              />
            </div>
            <p class="text-sm text-gray-500">{{ student.email }}</p>
          </div>

          <div class="flex items-center gap-6 text-sm">
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ student.fluencyScore }}%</div>
              <div class="text-gray-500">Fluidez</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ student.oralPracticeHours }}h</div>
              <div class="text-gray-500">Práctica</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-orange-600">{{ student.streak }}</div>
              <div class="text-gray-500">Racha</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-900">
                {{ student.activitiesCompleted }}/{{ student.totalActivities }}
              </div>
              <div class="text-gray-500">Actividades</div>
            </div>
          </div>

          <div class="text-xs text-gray-500 text-right">
            {{ formatLastActive(student.lastActiveDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Tabla -->
    <div
      v-else-if="viewMode === 'table'"
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estudiante
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nivel
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fluidez
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Práctica Oral
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Racha
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Progreso
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Última Actividad
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in students"
              :key="student.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              :class="{ 'bg-[#967AFE]/5': selectedStudent === student.id }"
              @click="onStudentClick(student.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-[#967AFE] to-[#48D19C] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3"
                  >
                    {{ getStudentInitials(student.name) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                    <div class="text-sm text-gray-500">{{ student.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge
                  :class="getLevelColor(student.level).bg + ' ' + getLevelColor(student.level).text"
                >
                  {{ student.level }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span
                    class="text-sm font-medium"
                    :class="getProgressStatus(student.fluencyScore).textColor"
                  >
                    {{ student.fluencyScore }}%
                  </span>
                  <div class="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all duration-300"
                      :class="getProgressStatus(student.fluencyScore).color"
                      :style="{ width: `${student.fluencyScore}%` }"
                    />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ student.oralPracticeHours }}h
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-orange-600">{{ student.streak }} días</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ student.activitiesCompleted }}/{{ student.totalActivities }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ Math.round((student.activitiesCompleted / student.totalActivities) * 100) }}%
                  completado
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatLastActive(student.lastActiveDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-2 h-2 rounded-full mr-2"
                    :class="getActivityStatus(student.lastActiveDate).color"
                  />
                  <span class="text-xs text-gray-600">{{
                    getActivityStatus(student.lastActiveDate).label
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-if="students.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
      <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
    </div>
  </section>
</template>
