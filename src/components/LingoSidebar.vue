<script setup lang="ts">
import { computed, ref } from 'vue'

import Button from '@/components/atoms/Button.vue'
import Badge from '@/components/atoms/Badge.vue'
import Separator from '@/components/atoms/Separator.vue'
import LingoLogo from '@/components/atoms/LingoLogo.vue'
import LingoCharacter from '@/components/atoms/LingoCharacter.vue'
import DecorativePattern from '@/components/atoms/DecorativePattern.vue'
import GradientButton from '@/components/molecules/GradientButton.vue'

import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  Settings as SettingsIcon,
  Mic,
  Target,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  FileText,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface NavigationItem {
  id: string
  label: string
  icon: Component
  to: string
  badge?: number
  gradient?: string
  active?: boolean
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'sectionChange', section: string): void
}>()

const onToggle = () => emit('toggle')
const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

const navigationSections = computed<NavigationSection[]>(() => [
  {
    title: 'Principal',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        gradient: 'from-[#967AFE] to-[#48D19C]',
        to: '/dashboard',
        active: isActive('/dashboard'),
      },
      {
        id: 'students',
        label: 'Estudiantes',
        icon: Users,
        badge: 12,
        gradient: 'from-[#48D19C] to-[#9AD0F0]',
        to: '/students',
        active: isActive('/students'),
      },
      {
        id: 'activities',
        label: 'Actividades',
        icon: BookOpen,
        badge: 3,
        gradient: 'from-[#FFAF54] to-[#FBEB6F]',
        to: '/activities',
        active: isActive('/activities'),
      },
    ],
  },
  {
    title: 'Análisis',
    items: [
      {
        id: 'reports',
        label: 'Reportes',
        icon: BarChart3,
        gradient: 'from-[#967AFE] to-[#FFAF54]',
        to: '/reports',
        active: isActive('/reports'),
      },
      {
        id: 'oral-practice',
        label: 'Práctica Oral',
        icon: Mic,
        gradient: 'from-[#967AFE] to-[#48D19C]',
        to: '/oral-practice',
        active: isActive('/oral-practice'),
      },
      {
        id: 'progress',
        label: 'Progreso',
        icon: Target,
        gradient: 'from-[#48D19C] to-[#9AD0F0]',
        to: '/progress',
        active: isActive('/progress'),
      },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      {
        id: 'calendar',
        label: 'Calendario',
        icon: Calendar,
        gradient: 'from-[#9AD0F0] to-[#967AFE]',
        to: '/calendar',
        active: isActive('/calendar'),
      },
      {
        id: 'achievements',
        label: 'Logros',
        icon: Award,
        gradient: 'from-[#FBEB6F] to-[#FFAF54]',
        to: '/achievements',
        active: isActive('/achievements'),
      },
      {
        id: 'case-study',
        label: 'Case Study',
        icon: FileText,
        gradient: 'from-[#967AFE] to-[#FFAF54]',
        to: '/slides',
        active: isActive('/slides'),
      },
    ],
  },
])

const onSectionChange = (to: string) => router.replace(to)
const contactSupport = () => router.push('/support')

// const isMobile = computed(() => window.matchMedia('(max-width: 1024px)').matches)
</script>

<template>
  <div
    v-motion
    :animate="{ width: isCollapsed ? 80 : 280 }"
    :transition="{ duration: 0.3, ease: 'ease-in-out' }"
    class="relative bg-white border-r border-gray-50 shadow-none flex flex-col h-full overflow-hidden"
  >
    <!-- Decorative background -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#F9F6FF] to-white" />
    <DecorativePattern class="absolute top-0 right-0 w-16 h-8 opacity-5" />

    <!-- Header -->
    <div class="relative z-10 p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <template v-if="!isCollapsed">
          <div
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :enter="{ opacity: 1, x: 0 }"
            :leave="{ opacity: 0, x: -20 }"
            :transition="{ duration: 0.2 }"
            class="flex items-center gap-3"
          >
            <LingoLogo class="w-10 h-10" />
            <div>
              <h2 class="font-['Satoshi',sans-serif] font-bold text-gray-900">LingoQuesto</h2>
              <p class="text-xs text-gray-500">Tutor de IA</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1 }"
            :leave="{ opacity: 0, scale: 0.8 }"
            :transition="{ duration: 0.2 }"
            class="flex justify-center w-full"
          >
            <LingoLogo class="w-8 h-8" />
          </div>
        </template>

        <Button
          variant="ghost"
          size="sm"
          @click="onToggle"
          class="p-2 hover:bg-[#967AFE]/10 text-gray-600 hover:text-[#967AFE]"
        >
          <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div
      v-if="!isCollapsed"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.1 }"
      class="relative z-10 p-4 border-b border-gray-100"
    >
      <GradientButton variant="primary" size="sm" :icon="Plus" class="w-full justify-start">
        Nueva Actividad
      </GradientButton>
    </div>

    <!-- Navigation -->
    <div class="relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-4">
      <div v-for="(section, sectionIndex) in navigationSections" :key="section.title" class="mb-6">
        <div
          v-if="!isCollapsed"
          v-motion
          :initial="{ opacity: 0, x: -10 }"
          :enter="{ opacity: 1, x: 0 }"
          :transition="{ delay: sectionIndex * 0.05 }"
          class="px-6 mb-3 font-['Satoshi',sans-serif] font-semibold text-xs uppercase tracking-wider text-gray-500"
        >
          {{ section.title }}
        </div>

        <div class="space-y-1">
          <div
            v-for="(item, itemIndex) in section.items"
            :key="item.id"
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{ opacity: 1, x: 0 }"
            :transition="{
              delay: (sectionIndex * section.items.length + itemIndex) * 0.03,
            }"
            class="px-3"
          >
            <Button
              variant="ghost"
              @click="onSectionChange(item.to)"
              :class="[
                'w-full justify-start relative overflow-hidden transition-all duration-200',
                isCollapsed ? 'px-0 justify-center' : 'px-3',
                item.active
                  ? `bg-gradient-to-r ${item.gradient || 'from-[#967AFE] to-[#48D19C]'} text-white shadow-lg`
                  : 'hover:bg-[#967AFE]/10 text-gray-700 hover:text-[#967AFE]',
              ]"
            >
              <!-- Icon -->
              <div :class="['flex items-center', isCollapsed ? '' : 'mr-3']">
                <component :is="item.icon" class="w-5 h-5" />
              </div>

              <!-- Label and Badge -->
              <template v-if="!isCollapsed">
                <div
                  v-motion
                  :initial="{ opacity: 0, width: 0 }"
                  :enter="{ opacity: 1, width: 'auto' }"
                  :leave="{ opacity: 0, width: 0 }"
                  :transition="{ duration: 0.2 }"
                  class="flex items-center justify-between flex-1"
                >
                  <span class="font-['Satoshi',sans-serif] font-medium">
                    {{ item.label }}
                  </span>

                  <Badge
                    v-if="item.badge"
                    :class="[
                      'ml-auto text-xs',
                      item.active ? 'bg-white/20 text-white' : 'bg-[#967AFE]/10 text-[#967AFE]',
                    ]"
                  >
                    {{ item.badge }}
                  </Badge>
                </div>
              </template>

              <!-- Active indicator -->
              <div
                v-if="item.active"
                class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
              />
            </Button>
          </div>
        </div>

        <Separator v-if="sectionIndex < navigationSections.length - 1" class="my-4 mx-6" />
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-10 border-t border-gray-100 p-4">
      <!-- Personaje y Ayuda -->
      <div :class="['flex items-center gap-3 mb-4', isCollapsed ? 'justify-center' : '']">
        <LingoCharacter variant="happy" class="w-8 h-8 flex-shrink-0" :animated="true" />

        <template v-if="!isCollapsed">
          <div
            v-motion
            :initial="{ opacity: 0, x: -10 }"
            :enter="{ opacity: 1, x: 0 }"
            :leave="{ opacity: 0, x: -10 }"
            :transition="{ duration: 0.2 }"
            class="flex-1"
          >
            <p class="text-xs text-gray-600 mb-1">¿Necesitas ayuda?</p>
            <Button
              variant="ghost"
              size="sm"
              @click="contactSupport"
              class="p-0 h-auto text-[#967AFE] hover:text-[#967AFE]/80 font-medium text-xs"
            >
              Contactar soporte
            </Button>
          </div>
        </template>
      </div>

      <!-- Settings and Notifications -->
      <div class="space-y-1">
        <Button
          variant="ghost"
          @click="onSectionChange('/notifications')"
          :class="[
            'w-full justify-start',
            isCollapsed ? 'px-0 justify-center' : 'px-3',
            'hover:bg-[#967AFE]/10 text-gray-700 hover:text-[#967AFE]',
          ]"
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="!isCollapsed"
            v-motion
            :initial="{ opacity: 0, width: 0 }"
            :enter="{ opacity: 1, width: 'auto' }"
            :leave="{ opacity: 0, width: 0 }"
            :transition="{ duration: 0.2 }"
            class="ml-3 font-['Satoshi',sans-serif] font-medium"
          >
            Notificaciones
          </span>
        </Button>

        <Button
          variant="ghost"
          @click="onSectionChange('/settings')"
          :class="[
            'w-full justify-start',
            isCollapsed ? 'px-0 justify-center' : 'px-3',
            'hover:bg-[#967AFE]/10 text-gray-700 hover:text-[#967AFE]',
          ]"
        >
          <SettingsIcon class="w-5 h-5" />
          <span
            v-if="!isCollapsed"
            v-motion
            :initial="{ opacity: 0, width: 0 }"
            :enter="{ opacity: 1, width: 'auto' }"
            :leave="{ opacity: 0, width: 0 }"
            :transition="{ duration: 0.2 }"
            class="ml-3 font-['Satoshi',sans-serif] font-medium"
          >
            Configuración
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>
