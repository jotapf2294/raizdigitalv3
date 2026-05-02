/**
 * Códice do Jota — Guardião Offline
 * Service Worker: offline-first robusto
 */

const CACHE_NAME = 'codice-cache-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/router.js',
  '/js/ui.js',
  '/js/lunar.js',
  '/js/db.js',
  '/js/seed.js',
  '/js/talhoes.js',
  '/js/herbario.js',
  '/js/notas.js',
  '/js/instrumentos.js',
  '/js/portico.js'
];

/* =========================================================
   📦 INSTALL
========================================================= */

self.addEventListener('install', (event) => {
  console.log('🛡️ SW: instalação do Códice');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});

/* =========================================================
   ⚡ ACTIVATE
========================================================= */

self.addEventListener('activate', (event) => {
  console.log('⚡ SW: ativo');

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================================================
   🌐 FETCH (offline-first seguro)
========================================================= */

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // só GET (evita problemas com POST/PUT)
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, copy);
          });

          return res;
        })
        .catch(() => {
          // fallback apenas para navegação
          if (req.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
