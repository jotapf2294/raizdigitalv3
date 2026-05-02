/**
 * Códice do Jota — Guardião Offline
 * Service Worker: protege o grimório da rede instável
 */

const CACHE_NAME = 'codice-cache-v1';

/**
 * Ficheiros essenciais do Códice
 * (shell da aplicação)
 */
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/router.js',
  '/js/ui.js',
  '/js/lunar.js',
  '/js/db.js',
  '/js/seed.js'
];

/**
 * INSTALAÇÃO — grava o Códice no cache
 */
self.addEventListener('install', (event) => {
  console.log('🛡️ SW: a instalar o Códice no cache');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

/**
 * ATIVAÇÃO — limpa caches antigos
 */
self.addEventListener('activate', (event) => {
  console.log('⚡ SW: ativado');

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 SW: a remover cache antigo', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/**
 * FETCH — intercepta pedidos
 * Estratégia: Cache First (offline-first real)
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          // Clonar resposta para guardar no cache
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // fallback silencioso (offline absoluto)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
