import { inject, provide, ref, onMounted, onBeforeUnmount, type InjectionKey, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface SidebarContextType {
  isMobile: Ref<boolean>
  isMobileSidebarOpen: Ref<boolean>
  toggleMobileSidebar: () => void
  currentSection: Ref<string>
  setCurrentSection: (section: string) => void
  backToDashboard: () => void
}

export interface ProvideSidebarOptions {
  initialSection?: string
  mobileBreakpoint?: number
}

const SidebarKey: InjectionKey<SidebarContextType> = Symbol('SidebarContext')

/**
 * Llama a esta función dentro de tu AppLayout (setup) para exponer el contexto.
 * Ej: const sidebar = provideSidebar({ initialSection: 'dashboard' })
 */
export function provideSidebar(options: ProvideSidebarOptions = {}) {
  const router = useRouter()
  const breakpoint = options.mobileBreakpoint ?? 1024

  const isMobile = ref(false)
  const isMobileSidebarOpen = ref(false)
  const currentSection = ref(options.initialSection ?? 'home')

  const updateIsMobile = () => {
    if (typeof window === 'undefined') return
    isMobile.value = window.innerWidth < breakpoint
    // Si pasamos a desktop, cerramos el sidebar móvil para evitar estados incoherentes
    if (!isMobile.value) isMobileSidebarOpen.value = false
  }

  const toggleMobileSidebar = () => {
    if (!isMobile.value) return
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  const setCurrentSection = (section: string) => {
    currentSection.value = section
    router.replace(`/${section}`)
  }

  const backToDashboard = () => {
    setCurrentSection('dashboard')
    isMobileSidebarOpen.value = false
  }

  onMounted(() => {
    updateIsMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateIsMobile)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateIsMobile)
    }
  })

  const ctx: SidebarContextType = {
    isMobile,
    isMobileSidebarOpen,
    toggleMobileSidebar,
    currentSection,
    setCurrentSection,
    backToDashboard,
  }

  provide(SidebarKey, ctx)
  return ctx
}

/**
 * Inyéctalo en cualquier componente descendiente de AppLayout.
 * Arroja error si se usa fuera del layout (como en tu hook de React).
 */
export function useSidebar() {
  const ctx = inject(SidebarKey)
  if (!ctx) throw new Error('useSidebar must be used within AppLayout')
  return ctx
}

export default useSidebar
