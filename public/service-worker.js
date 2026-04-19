// Service Worker — Network First (toujours la version la plus récente)
const CACHE_NAME = 'nokomplex-ai-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ne jamais intercepter les appels API
  if (event.request.url.includes('/.netlify/functions/') ||
      event.request.url.includes('ipapi.co') ||
      event.request.url.includes('nominatim.openstreetmap.org') ||
      event.request.url.includes('openweathermap.org')) {
    return;
  }

  // Network First — toujours charger la dernière version depuis le réseau
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la nouvelle version
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Fallback cache seulement si hors ligne
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
  );
});
