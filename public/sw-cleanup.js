// Service Worker for Voice Chat Connection Cleanup
const SW_VERSION = '1.0.0'
const CLEANUP_CACHE = 'voice-chat-cleanup-v1'

// Install event - cache cleanup data
self.addEventListener('install', (event) => {
  console.log('🧹 Voice Chat Cleanup Service Worker installing...')
  event.waitUntil(
    caches.open(CLEANUP_CACHE).then((cache) => {
      console.log('✅ Cleanup cache opened')
      return cache.addAll(['/cleanup-fallback.html'])
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🧹 Voice Chat Cleanup Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CLEANUP_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Message event - handle cleanup requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_CONNECTION') {
    console.log('🧹 Cleanup request received:', event.data)

    // Store cleanup data for later use
    event.waitUntil(
      caches.open(CLEANUP_CACHE).then((cache) => {
        const cleanupData = {
          roomId: event.data.roomId,
          userId: event.data.userId,
          timestamp: Date.now(),
        }

        return cache.put(`cleanup-${event.data.userId}`, new Response(JSON.stringify(cleanupData)))
      }),
    )

    // Instead of making HTTP calls from service worker,
    // we'll notify the main thread to handle cleanup
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PERFORM_CLEANUP',
            data: event.data,
          })
        })
      }),
    )

    console.log('📡 Cleanup request forwarded to main thread')
  }
})

// Fetch event - handle cleanup fallback
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/cleanup-fallback')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || new Response('Cleanup fallback page')
      }),
    )
  }
})

// Background sync for cleanup (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'cleanup-connection') {
    console.log('🔄 Background sync cleanup triggered')
    event.waitUntil(performCleanup())
  }
})

async function performCleanup() {
  try {
    const cache = await caches.open(CLEANUP_CACHE)
    const keys = await cache.keys()

    for (const key of keys) {
      if (key.includes('cleanup-')) {
        const response = await cache.match(key)
        const cleanupData = await response.json()

        console.log('🧹 Performing background cleanup for:', cleanupData)

        // Notify main thread to perform cleanup
        const clients = await self.clients.matchAll()
        clients.forEach((client) => {
          client.postMessage({
            type: 'PERFORM_CLEANUP',
            data: cleanupData,
          })
        })

        // Remove from cache after forwarding
        await cache.delete(key)
      }
    }
  } catch (error) {
    console.error('❌ Background cleanup error:', error)
  }
}

console.log('🧹 Voice Chat Cleanup Service Worker loaded, version:', SW_VERSION)
