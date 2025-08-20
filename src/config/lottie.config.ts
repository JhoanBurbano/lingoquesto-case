export const LOTTIE_CONFIG = {
  // Preload delay to prioritize critical rendering
  PRELOAD_DELAY: 100,

  // Fallback timeout for Lottie loading
  LOAD_TIMEOUT: 3000,

  // Animation settings
  ANIMATION: {
    autoplay: true,
    loop: true,
    speed: 1,
  },

  // Performance settings
  PERFORMANCE: {
    // Use low quality on slow devices
    lowQuality: window.navigator.hardwareConcurrency < 4,
    // Reduce frame rate on mobile
    frameRate: window.innerWidth < 768 ? 30 : 60,
  },
}

// Utility function to check if device supports Lottie well
export const shouldUseLottie = (): boolean => {
  // Check for WebGL support
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  // Check for hardware acceleration
  const isLowEnd = window.navigator.hardwareConcurrency < 4
  const isMobile = window.innerWidth < 768

  return !!(gl && !isLowEnd && !isMobile)
}
