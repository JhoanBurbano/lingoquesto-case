<template>
  <div class="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
    <!-- Gradient accent -->
    <div
      v-if="showGradientAccent"
      class="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
      :class="['bg-gradient-to-r', gradient]"
    />

    <div class="flex items-start justify-between">
      <!-- Left side: Icon and content -->
      <div class="flex-1">
        <!-- Icon -->
        <div
          v-if="icon"
          class="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4"
          :class="`bg-gradient-to-r ${gradient}`"
        >
          <component :is="getIcon(icon)" class="w-8 h-8" />
        </div>

        <!-- Title -->
        <p class="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{{ title }}</p>

        <!-- Main value -->
        <p class="text-3xl font-bold text-gray-900 mb-1">{{ value }}</p>

        <!-- Context text -->
        <p v-if="context" class="text-sm text-gray-500 mb-1">{{ context }}</p>

        <!-- Description -->
        <p v-if="description" class="text-sm text-gray-500">{{ description }}</p>
      </div>

      <!-- Right side: Change indicator -->
      <div v-if="change !== undefined" class="text-right">
        <div
          class="flex items-center gap-1"
          :class="change >= 0 ? 'text-green-600' : 'text-blue-500'"
        >
          <component :is="change >= 0 ? 'TrendingUp' : 'TrendingDown'" class="w-4 h-4" />
          <span class="text-sm font-medium"> {{ change >= 0 ? '+' : '' }}{{ change }}% </span>
        </div>
        <p v-if="changeLabel" class="text-xs text-gray-400 mt-1">{{ changeLabel }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import {
  Trophy,
  Users,
  Award,
  TrendingUp,
  Mic,
  Calendar,
  Flame,
  Volume2,
  BookOpen,
  Crown,
  Star,
  Target,
  Zap,
  Shield,
  Palette,
  Code,
  CheckCircle,
  Play,
  Settings,
  Bell,
  Sparkles,
  BarChart3,
  MessageCircle,
} from 'lucide-vue-next'

defineOptions({ name: 'MetricCard' })

interface Props {
  title: string
  value: string | number
  icon?: string
  gradient: string
  showGradientAccent?: boolean
  context?: string
  description?: string
  change?: number
  changeLabel?: string
}

defineProps<Props>()

const getIcon = (iconName: string) => {
  const iconMap: Record<string, Component> = {
    trophy: Trophy,
    users: Users,
    award: Award,
    'trending-up': TrendingUp,
    mic: Mic,
    calendar: Calendar,
    flame: Flame,
    volume2: Volume2,
    bookOpen: BookOpen,
    crown: Crown,
    star: Star,
    target: Target,
    zap: Zap,
    shield: Shield,
    palette: Palette,
    code: Code,
    checkCircle: CheckCircle,
    play: Play,
    settings: Settings,
    bell: Bell,
    sparkles: Sparkles,
    barChart3: BarChart3,
    messageCircle: MessageCircle,
  }

  return iconMap[iconName] || Trophy
}
</script>

<style scoped>
/* Sin estilos adicionales por ahora */
</style>
