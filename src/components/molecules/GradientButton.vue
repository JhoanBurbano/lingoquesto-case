<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { Component } from 'vue'
import { cn } from '../../utils'

type Variant = 'primary' | 'secondary' | 'success' | 'warning'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    icon?: Component | null
    loading?: boolean
    className?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    icon: null,
    loading: false,
    className: '',
  },
)

const attrs = useAttrs()

const gradients: Record<Variant, string> = {
  primary: 'from-[#967AFE] to-[#48D19C]',
  secondary: 'from-[#967AFE] to-[#FFAF54]',
  success: 'from-[#48D19C] to-[#9AD0F0]',
  warning: 'from-[#FFAF54] to-[#FBEB6F]',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const classes = computed(() =>
  cn(
    "relative overflow-hidden rounded-xl font-['Satoshi',sans-serif]",
    'bg-gradient-to-r',
    gradients[props.variant],
    sizes[props.size],
    'text-white border-0 cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-4 focus:ring-[#967AFE]/30',
    'shadow-lg hover:shadow-xl transition-all duration-200',
    props.className,
    (attrs as any).class,
  ),
)
</script>

<template>
  <button
    v-motion
    :initial="{ scale: 1 }"
    :hovered="{ scale: 1.02 }"
    :pressed="{ scale: 0.98 }"
    ref="ref"
    :class="classes"
    :disabled="props.loading"
    v-bind="attrs"
    type="button"
  >
    <!-- Shimmer effect (mismas clases que el original) -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
    />

    <div class="relative flex items-center justify-center gap-2">
      <div
        v-if="props.loading"
        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
      />
      <template v-else>
        <span v-if="props.icon" class="flex items-center">
          <component :is="props.icon" />
        </span>
        <span><slot /></span>
      </template>
    </div>
  </button>
</template>
