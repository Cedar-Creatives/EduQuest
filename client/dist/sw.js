const CACHE_NAME = 'eduquest-v1.0.0';
const STATIC_CACHE = 'eduquest-static-v1.0.0';
const DYNAMIC_CACHE = 'eduquest-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // API requests - try network first, fallback to cache
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful API responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Fallback to cached response if available
            return caches.match(request);
          })
      );
      return;
    }

    // Static assets - cache first, fallback to network
    if (request.destination === 'script' || 
        request.destination === 'style' || 
        request.destination === 'image') {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            return response || fetch(request);
          })
      );
      return;
    }

    // HTML pages - network first, fallback to cache
    if (request.destination === 'document') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful page responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Fallback to cached response if available
            return caches.match(request);
          })
      );
      return;
    }
  }

  // Default behavior - network first
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'quiz-progress') {
    event.waitUntil(syncQuizProgress());
  }
});

// Sync quiz progress when back online
async function syncQuizProgress() {
  try {
    const db = await openDB('EduQuestDB', 1);
    const offlineActions = await db.getAll('offlineActions');
    
    for (const action of offlineActions) {
      try {
        // Attempt to sync the action
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful sync
        await db.delete('offlineActions', action.id);
      } catch (error) {
        console.log('Failed to sync action:', action, error);
      }
    }
  } catch (error) {
    console.log('Error syncing offline actions:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from EduQuest',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('EduQuest', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Message received in SW:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
