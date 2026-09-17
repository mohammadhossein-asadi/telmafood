const CACHE_NAME = 'telmafood-v1';
const STATIC_CACHE = 'telmafood-static-v1';
const DYNAMIC_CACHE = 'telmafood-dynamic-v1';
const IMAGE_CACHE = 'telmafood-images-v1';

const STATIC_ASSETS = [
  '/',
  '/recipes',
  '/saved',
  '/manifest.json',
  '/images/logo-light.svg',
  '/images/logo-dark.svg',
];

const CACHE_STRATEGIES = {
  static: 'cache-first',
  images: 'cache-first',
  api: 'network-first',
  fonts: 'cache-first',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Determine cache strategy based on request type
  const isImage = request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i);
  const isFont = request.destination === 'font' || url.pathname.match(/\.(woff|woff2|ttf|eot)$/i);
  const isAPI = url.pathname.startsWith('/api/');
  const isStatic = STATIC_ASSETS.some((asset) => url.pathname === asset || url.pathname.startsWith(asset));

  if (isStatic) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImage) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isFont) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPI) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/');
    }
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/');
    }
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-saved-recipes') {
    event.waitUntil(syncSavedRecipes());
  }
});

async function syncSavedRecipes() {
  // Implement sync logic for saved recipes when online
  console.log('Syncing saved recipes...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/logo-light.svg',
    badge: '/images/logo-light.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});