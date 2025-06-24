/**
 * Service Worker - Cache Offline et Optimisations
 * 
 * Ce Service Worker améliore les performances en :
 * - Mettant en cache les ressources statiques
 * - Permettant la navigation offline
 * - Préchargeant les pages populaires
 * - Optimisant les requêtes API
 */

const CACHE_NAME = 'checkpoint-v1';
const STATIC_CACHE = 'checkpoint-static-v1';
const API_CACHE = 'checkpoint-api-v1';

// Ressources à mettre en cache immédiatement
const STATIC_RESOURCES = [
  '/',
  '/search',
  '/connexion',
  '/inscription',
  '/legal',
  '/images/Logo/Crystal.png',
  '/images/default-game-cover.png',
  '/images/Game/Default game.jpg',
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First : Pour les ressources statiques
  CACHE_FIRST: 'cache-first',
  // Network First : Pour les API
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate : Pour les données qui changent peu
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installé');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Mise en cache des ressources statiques');
      return cache.addAll(STATIC_RESOURCES);
    })
  );
  
  // Activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activé');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Prise de contrôle immédiate
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Stratégie selon le type de ressource
  if (isStaticResource(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirst(request));
  } else if (isPageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Fonctions utilitaires
function isStaticResource(url) {
  return url.pathname.startsWith('/images/') ||
         url.pathname.startsWith('/_next/static/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') ||
         url.hostname === 'images.igdb.com';
}

function isPageRequest(url) {
  return url.pathname.startsWith('/games/') ||
         url.pathname === '/search' ||
         url.pathname === '/connexion' ||
         url.pathname === '/inscription';
}

// Stratégie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
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
    // Retourner une page d'erreur offline si disponible
    const offlineResponse = await cache.match('/offline');
    return offlineResponse || new Response('Ressource non disponible offline', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);
  
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
    throw error;
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Toujours essayer de récupérer depuis le réseau
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cachedResponse);
  
  // Retourner le cache immédiatement si disponible
  return cachedResponse || networkPromise;
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Synchroniser les données en arrière-plan
    console.log('🔄 Synchronisation en arrière-plan');
    
    // Ici vous pouvez ajouter la logique de synchronisation
    // Par exemple, synchroniser les données utilisateur
    
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/Logo/Crystal.png',
      badge: '/images/Logo/Crystal.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Voir',
          icon: '/images/Logo/Crystal.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/images/Logo/Crystal.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 