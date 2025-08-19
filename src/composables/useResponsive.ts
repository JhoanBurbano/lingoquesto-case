import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  currentBreakpoint: keyof Breakpoints
  width: number
  height: number
}

const BREAKPOINTS: Breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function useResponsive() {
  const width = ref(0)
  const height = ref(0)
  const currentBreakpoint = ref<keyof Breakpoints>('lg')

  // Computed responsive states
  const isMobile = computed(() => width.value < BREAKPOINTS.md)
  const isTablet = computed(() => width.value >= BREAKPOINTS.md && width.value < BREAKPOINTS.lg)
  const isDesktop = computed(() => width.value >= BREAKPOINTS.lg)
  const isLargeDesktop = computed(() => width.value >= BREAKPOINTS.xl)

  // Update dimensions and breakpoint
  const updateDimensions = () => {
    if (typeof window === 'undefined') return

    width.value = window.innerWidth
    height.value = window.innerHeight

    // Determine current breakpoint
    if (width.value >= BREAKPOINTS['2xl']) {
      currentBreakpoint.value = '2xl'
    } else if (width.value >= BREAKPOINTS.xl) {
      currentBreakpoint.value = 'xl'
    } else if (width.value >= BREAKPOINTS.lg) {
      currentBreakpoint.value = 'lg'
    } else if (width.value >= BREAKPOINTS.md) {
      currentBreakpoint.value = 'md'
    } else if (width.value >= BREAKPOINTS.sm) {
      currentBreakpoint.value = 'sm'
    } else {
      currentBreakpoint.value = 'xs'
    }
  }

  // Check if current width matches a breakpoint
  const isBreakpoint = (breakpoint: keyof Breakpoints) => {
    return currentBreakpoint.value === breakpoint
  }

  // Check if current width is above a breakpoint
  const isAboveBreakpoint = (breakpoint: keyof Breakpoints) => {
    return width.value >= BREAKPOINTS[breakpoint]
  }

  // Check if current width is below a breakpoint
  const isBelowBreakpoint = (breakpoint: keyof Breakpoints) => {
    return width.value < BREAKPOINTS[breakpoint]
  }

  // Get responsive classes based on breakpoint
  const getResponsiveClasses = (classes: Record<keyof Breakpoints, string>) => {
    return classes[currentBreakpoint.value] || classes.lg
  }

  // Lifecycle
  onMounted(() => {
    updateDimensions()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDimensions)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateDimensions)
    }
  })

  return {
    // State
    width,
    height,
    currentBreakpoint,

    // Computed states
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,

    // Methods
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint,
    getResponsiveClasses,

    // Constants
    BREAKPOINTS,
  }
}
