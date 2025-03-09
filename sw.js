const CACHE_NAME = "propcalc-v1";
// Add offline fallback page
const OFFLINE_URL = "offline.html";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

// Install the service worker and cache the files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Cache opened");
        // Add offline.html to the cache
        return cache.addAll([...urlsToCache, OFFLINE_URL]);
      })
      .then(() => {
        console.log("[ServiceWorker] All resources cached");
        return self.skipWaiting();
      })
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("[ServiceWorker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[ServiceWorker] Activated");
        return self.clients.claim();
      })
  );
});

// Fetch content from cache first, then network with improved offline fallback
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url);

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response
      if (response) {
        console.log("[ServiceWorker] Found in cache:", event.request.url);
        return response;
      }

      console.log("[ServiceWorker] Network fetch:", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.log(
            "[ServiceWorker] Fetch failed, serving offline page",
            error
          );

          // Return the offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }

          // Just fail for non-navigation requests
          return new Response("Offline content not available.", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    })
  );
});
