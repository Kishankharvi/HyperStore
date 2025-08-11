

/*
  Service Worker for Offline Caching and Background Sync
*/

const CACHE_VERSION = 6; // Increment this version to force cache updates
const STATIC_CACHE_NAME = `hyperstore-static-v${CACHE_VERSION}`;
const API_CACHE_NAME = `hyperstore-api-v${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `hyperstore-images-v${CACHE_VERSION}`;

// App Shell: Core files needed for the app to run.
// These are updated automatically by your build process.
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // These filenames are from your `dist` folder.
  // IMPORTANT: You MUST update these after every `npm run build`
  '/assets/index-BVOAATHq.js',
  '/assets/index-C5aMiuAh.css',
  '/assets/index.html'
];

// --- IndexedDB for Queued Requests ---

const DB_NAME = 'offline-requests-db';
const STORE_NAME = 'requests';
const DB_VERSION = 1;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject("Error opening DB");
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function storeRequest(request) {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const body = request.method === 'GET' ? null : await request.clone().json();
  
  await store.add({
    url: request.url,
    method: request.method,
    body: body,
    headers: Object.fromEntries(request.headers.entries()),
    timestamp: Date.now()
  });
  await tx.done;
}

async function replayRequests() {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const requests = await store.getAll();

  for (const req of requests) {
    try {
      const response = await fetch(req.url, {
        method: req.method,
        headers: new Headers(req.headers),
        body: req.body ? JSON.stringify(req.body) : null,
      });

      if (response.ok) {
        console.log(`[Service Worker] Replayed request to ${req.url} successfully.`);
        await store.delete(req.id);
      } else {
        console.error(`[Service Worker] Failed to replay request to ${req.url}. Status: ${response.status}`);
        // Decide if you want to keep or delete the request on failure
      }
    } catch (error) {
      console.error(`[Service Worker] Network error during replay for ${req.url}.`, error);
      // The request will remain in the DB to be tried again later.
    }
  }
  await tx.done;
}


// --- Service Worker Lifecycle Events ---

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

// --- Fetch Event Handler ---

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: API GET Requests (Stale-While-Revalidate)
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
          // This catch handles network failures, returning undefined if no cache exists
          console.warn(`[Service Worker] API GET request for ${request.url} failed. Serving from cache if available.`);
        });
        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // Strategy 2: API non-GET Requests (Network Only with Offline Fallback)
  if (url.pathname.startsWith('/api/') && request.method !== 'GET') {
    event.respondWith(
      fetch(request.clone()).catch(async (error) => {
        console.log('[Service Worker] Request failed, queuing for background sync:', request.url);
        await storeRequest(request);
        
        // Register a sync event to process the queue
        if ('sync' in self.registration) {
          self.registration.sync.register('sync-failed-requests');
        }

        // Return a custom response indicating the action was queued
        return new Response(
          JSON.stringify({
            message: 'This action is queued and will be synced when you are back online.',
            queued: true
          }),
          {
            status: 202, // Accepted
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Strategy 3: Image Requests (Cache First, then Network)
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          return cachedResponse || fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy 4: Static Assets (Cache First)
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});


// --- Background Sync Event ---
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-failed-requests') {
    console.log('[Service Worker] Background sync triggered for failed requests.');
    event.waitUntil(replayRequests());
  }
});
