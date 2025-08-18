<script setup lang="ts">
import { ref } from 'vue'
import LingoSidebar from '@/components/LingoSidebar.vue'
import { RouterView } from 'vue-router'
import { provideSidebar } from '@/composables/useSidebar'

const isCollapsed = ref(false)
const currentSection = ref('dashboard')

// Provide sidebar context for all routed views
const sidebar = provideSidebar({ initialSection: currentSection.value })

function handleToggle() {
  isCollapsed.value = !isCollapsed.value
}

function handleSectionChange(section: string) {
  currentSection.value = section
  // Keep provider state in sync
  sidebar.setCurrentSection(section)
}
</script>

<template>
  <div class="min-h-screen flex bg-background text-foreground">
    <aside class="w-64 border-r border-border bg-sidebar text-sidebar-foreground">
      <LingoSidebar
        :is-collapsed="isCollapsed"
        :current-section="currentSection"
        @toggle="handleToggle"
        @section-change="handleSectionChange"
      />
    </aside>
    <main class="flex-1 overflow-auto h-screen">
      <RouterView />
    </main>
  </div>
</template>
