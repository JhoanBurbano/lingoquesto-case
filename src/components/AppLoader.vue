<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center"
  >
    <div class="text-center">
      <!-- Immediate Loading Spinner (shows instantly) -->
      <div v-if="!lottieLoaded" class="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"
        ></div>
      </div>

      <!-- Lottie Animation (lazy loaded) -->
      <div v-else class="w-32 h-32 mx-auto mb-4">
        <component
          v-if="DotLottieComponent"
          :is="DotLottieComponent"
          autoplay
          loop
          :src="lottieSrc"
          style="width: 100%; height: 100%"
          @load="onLottieLoad"
        />
      </div>

      <p class="text-gray-600">{{ message }}</p>

      <!-- Progress indicator for better UX -->
      <div v-if="showProgress" class="mt-4">
        <div class="w-48 bg-gray-200 rounded-full h-2 mx-auto">
          <div
            class="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, shallowRef } from 'vue'
import { LOTTIE_CONFIG, shouldUseLottie } from '@/config/lottie.config'

interface Props {
  message?: string
  showProgress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Inicializando LingoQuesto...',
  showProgress: true,
})

const lottieLoaded = ref(false)
const lottieSrc = '/assets/lingosto-waiting.lottie'
const DotLottieComponent = shallowRef<
  (typeof import('@lottiefiles/dotlottie-vue'))['DotLottieVue'] | null
>(null)

// Progress animation for better perceived performance
const progressWidth = ref(0)
const showProgress = computed(() => props.showProgress)

// Check if device supports Lottie well
const supportsLottie = ref(shouldUseLottie())

onMounted(async () => {
  // Start progress animation immediately
  if (showProgress.value) {
    animateProgress()
  }

  // Only load Lottie if device supports it well
  if (supportsLottie.value) {
    // Lazy load Lottie after delay to prioritize critical rendering
    setTimeout(async () => {
      try {
        const { DotLottieVue } = await import('@lottiefiles/dotlottie-vue')
        DotLottieComponent.value = DotLottieVue
        // Component will be available in next tick
        nextTick(() => {
          lottieLoaded.value = true
        })
      } catch (error) {
        console.warn('Failed to load Lottie component:', error)
        // Keep showing spinner if Lottie fails to load
      }
    }, LOTTIE_CONFIG.PRELOAD_DELAY)
  } else {
    // For low-end devices, skip Lottie entirely
    lottieLoaded.value = true
  }
})

const animateProgress = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 90) {
      progress = 90 // Don't complete until auth is done
      clearInterval(interval)
    }
    progressWidth.value = progress
  }, 200)
}

const onLottieLoad = () => {
  console.log('🎬 Lottie animation loaded successfully')
}
</script>
