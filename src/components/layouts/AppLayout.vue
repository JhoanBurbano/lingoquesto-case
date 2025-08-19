<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import LingoSidebar from '@/components/LingoSidebar.vue'
import { RouterView } from 'vue-router'
import { provideSidebar } from '@/composables/useSidebar'

import { Menu, X, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import Button from '@/components/atoms/Button.vue'

const isCollapsed = ref(false)
const currentSection = ref('dashboard')
const isMobileSidebarOpen = ref(false)

// Mobile detection
const isMobileWorking = computed(() => {
  return typeof window !== 'undefined' && window.innerWidth < 768
})

// Provide sidebar context for all routed views
const sidebar = provideSidebar({ initialSection: currentSection.value })

// Sidebar toggle functions
function handleToggle() {
  if (isMobileWorking.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

// Mobile specific toggle function
function handleMobileToggle() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

function handleSectionChange(section: string) {
  currentSection.value = section
  // Keep provider state in sync
  sidebar.setCurrentSection(section)

  // Close mobile sidebar after navigation
  if (isMobileWorking.value) {
    isMobileSidebarOpen.value = false
  }
}

// Close mobile sidebar when clicking outside
function handleOutsideClick(event: Event) {
  const target = event.target as HTMLElement

  // Don't close if clicking on mobile header or toggle button
  if (target.closest('.mobile-header') || target.closest('button')) {
    return
  }

  if (
    isMobileWorking.value &&
    isMobileSidebarOpen.value &&
    !target.closest('.sidebar-mobile-overlay')
  ) {
    isMobileSidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// Computed classes
const sidebarClasses = computed(() => {
  // En desktop, el sidebar está en el flujo normal del layout
  // Con animación para ocultarse al cambiar a mobile
  if (isMobileWorking.value) {
    return 'w-0 opacity-0 pointer-events-none'
  }
  return isCollapsed.value ? 'w-20' : 'w-80'
})

const layoutClasses = computed(() => {
  // Layout base que funciona para todos los dispositivos
  return 'min-h-screen flex bg-background text-foreground relative'
})

// Watch for mobile changes to animate sidebar
watch(isMobileWorking, (newIsMobile) => {
  if (newIsMobile) {
    // Cuando cambia a mobile, cerrar sidebar desktop
    isCollapsed.value = false
  }
})
</script>

<template>
  <div :class="layoutClasses">
    <!-- Mobile overlay for smooth animation -->
    <div
      v-if="isMobileWorking"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-all duration-300 ease-out pointer-events-none"
      :class="isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'"
      @click="isMobileSidebarOpen = false"
    />

    <!-- Sidebar - En mobile está fuera del flujo del layout -->
    <aside
      v-if="!isMobileWorking"
      :class="[
        'sidebar-container transition-all duration-500 ease-in-out border-r border-border bg-sidebar text-sidebar-foreground relative',
        sidebarClasses,
      ]"
    >
      <LingoSidebar
        :is-collapsed="isCollapsed"
        :current-section="currentSection"
        :is-mobile="isMobileWorking"
        @toggle="handleToggle"
        @section-change="handleSectionChange"
      />

      <!-- Floating Toggle Button (Desktop only) -->
      <div v-if="!isMobileWorking" class="absolute -right-0 top-10 z-50">
        <Button variant="default" size="sm" @click="handleToggle" class="sidebar-toggle-floating">
          <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </Button>
      </div>
    </aside>

    <!-- Mobile Sidebar - Completamente separado del layout -->
    <aside
      v-if="isMobileWorking"
      :class="[
        'fixed inset-y-0 left-0 z-50 w-80 border-r border-gray-200 bg-white sidebar-mobile-overlay shadow-2xl',
        isMobileSidebarOpen
          ? 'transform translate-x-0 opacity-100'
          : 'transform -translate-x-full opacity-0',
      ]"
      style="transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <LingoSidebar
        :is-collapsed="false"
        :current-section="currentSection"
        :is-mobile="true"
        @toggle="handleMobileToggle"
        @section-change="handleSectionChange"
      />
    </aside>

    <!-- Main content -->
    <main :class="['overflow-auto h-screen', isMobileWorking ? 'main-mobile' : 'main-desktop']">
      <!-- Mobile header with toggle button -->
      <div
        v-if="isMobileWorking"
        class="mobile-header sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:hidden"
      >
        <div class="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            @click="handleMobileToggle"
            class="p-2 hover:bg-[#967AFE]/10 text-gray-600 hover:text-[#967AFE]"
          >
            <Menu v-if="!isMobileSidebarOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </Button>

          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-r from-[#967AFE] to-[#48D19C] rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">LQ</span>
            </div>
            <span class="font-semibold text-gray-900">LingoQuesto</span>
          </div>

          <div class="w-10"></div>
          <!-- Spacer for centering -->
        </div>
      </div>

      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.sidebar-container {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@media (min-width: 1024px) {
  .sidebar-container {
    box-shadow: none;
  }
}

/* Mobile Sidebar Animations */
.sidebar-mobile-overlay {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Enhanced shadow for mobile sidebar */
.sidebar-mobile-overlay {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Smooth content animation inside sidebar */
.sidebar-mobile-overlay > * {
  transition: opacity 0.3s ease-out;
  transition-delay: 0.15s;
}

.sidebar-mobile-overlay:not(.transform.translate-x-0) > * {
  opacity: 0;
  transition-delay: 0s;
}

/* Smooth slide animation for mobile sidebar */
@keyframes sidebar-slide-in {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes sidebar-slide-out {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%) scale(0.95);
    opacity: 0;
  }
}

/* Apply smooth slide animation when sidebar opens */
.sidebar-mobile-overlay.transform.translate-x-0 {
  animation: sidebar-slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Keep current exit animation */
.sidebar-mobile-overlay:not(.transform.translate-x-0) {
  animation: sidebar-slide-out 0.3s ease-in-out;
}
</style>
