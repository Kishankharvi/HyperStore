
const STATIC_CACHE_NAME = "hyperstore-static";
const API_CACHE_NAME = "hyperstore-api";
const IMAGE_CACHE_NAME = "hyperstore-images";


// App Shell: Core files needed for the app to run
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-144x144.png',
  '/icons/icon-48x48.png',
, '/assets/index-COccNsM1.css ',
'/assets/index-tt1PDuwc.js',


  '/assets/index.html'
];


self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(APP_SHELL_FILES);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache app shell files:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
 
  const cacheWhitelist = [STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});



self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/') && request.method === 'GET') {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const networkFetch = fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          console.warn(`[Service Worker] API GET request for ${request.url} failed. Serving from cache if available.`);
        });
        return cachedResponse || networkFetch;
      })
    );
    return;
  }



  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async cache => {
        const cachedResponse = await cache.match(request);
        return cachedResponse || fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});


