const CACHE_NAME = 'zenvra-v1.0.0';
const STATIC_CACHE = 'zenvra-static-v1';
const DYNAMIC_CACHE = 'zenvra-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/zenvralogo.png',
  '/images/velocityOne.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/promotions/public/promotions',
  '/api/promotions/public/coupons'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset) || 
      url.pathname.startsWith('/icons/') || 
      url.pathname.startsWith('/images/')) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests with cache-first strategy
  // Skip service worker for dev server requests
  if (request.url.startsWith('http://localhost:5173') || request.url.startsWith('ws://localhost:5173')) {
    return;
  }
  event.respondWith(handleDynamicRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for specific API endpoints
    if (request.url.includes('/api/products')) {
      return new Response(JSON.stringify({
        products: [],
        message: 'Offline mode - produtos não disponíveis'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.url.includes('/api/promotions')) {
      return new Response(JSON.stringify({
        promotions: [],
        coupons: [],
        message: 'Offline mode - promoções não disponíveis'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generic error response
    return new Response(JSON.stringify({
      error: 'Offline mode - API não disponível'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('❌ Failed to fetch static asset:', request.url);
    
    // Return placeholder image if image request fails
    if (request.url.includes('/images/')) {
      return new Response('', {
        status: 404,
        statusText: 'Image not available offline'
      });
    }
    
    throw error;
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Navigation failed, serving cached index.html');
    
    // Always serve index.html for navigation requests (SPA)
    const cachedIndex = await caches.match('/index.html');
    
    if (cachedIndex) {
      return cachedIndex;
    }
    
    // Fallback to basic offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Zenvra - Offline</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f1a21;
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          p {
            margin: 0 0 20px 0;
            opacity: 0.7;
          }
          .retry-btn {
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          }
          .retry-btn:hover {
            background: #059669;
          }
        </style>
      </head>
      <body>
        <div class="offline-icon">📱</div>
        <h1>Zenvra Offline</h1>
        <p>Você está offline. Verifique sua conexão e tente novamente.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Tentar Novamente
        </button>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle dynamic requests with cache-first strategy
async function handleDynamicRequest(request) {
  // Ignorar requests chrome-extension://
  if (request.url.startsWith('chrome-extension://')) {
    return fetch(request);
  }
  
  // Apenas cache requests http:// ou https://
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return fetch(request);
  }
  
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('❌ Dynamic request failed:', request.url);
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlist());
  }
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

// Sync wishlist with server
async function syncWishlist() {
  try {
    const wishlist = localStorage.getItem('zenvra-wishlist');
    if (wishlist) {
      // Here you would sync with server
      console.log('💝 Syncing wishlist with server...');
    }
  } catch (error) {
    console.error('❌ Failed to sync wishlist:', error);
  }
}

// Sync cart with server
async function syncCart() {
  try {
    const cart = localStorage.getItem('zenvra-cart');
    if (cart) {
      // Here you would sync with server
      console.log('🛒 Syncing cart with server...');
    }
  } catch (error) {
    console.error('❌ Failed to sync cart:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📢 Push notification received:', event);
  
  const options = {
    body: 'Novos produtos disponíveis na Zenvra!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Produtos',
        icon: '/icons/products-96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/close-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Zenvra', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#produtos')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for app updates
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚀 Zenvra Service Worker loaded successfully!');
