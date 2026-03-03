/**
 * SERVICE WORKER FOR BRAIDLY PWA
 * Simplified to avoid response cloning issues
 */

const CACHE_NAME = 'braidly-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Ignore errors during install
      })
    }).then(() => {
      self.skipWaiting()
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip API and Supabase requests - network only
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Offline', { status: 503 })
      })
    )
    return
  }

  // For everything else, try network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((response) => {
        return response || new Response('Offline', { status: 503 })
      })
    })
  )
})
