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
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Utiliser addAll avec gestion d'erreur pour éviter les échecs
      const cachePromises = [
        '/',
        '/offline',
        '/images/Logo/Crystal.png',
        '/images/default-game-cover.png',
        '/images/Game/Default game.jpg'
      ].map(url => 
        cache.add(url).catch(error => {
          console.warn(`Échec du cache pour ${url}:`, error);
          return null;
        })
      );
      
      return Promise.all(cachePromises);
    })
  );
  
  // Prise de contrôle immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
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
  
  // Ignorer les requêtes chrome-extension et autres schémas non supportés
  if (url.protocol === 'chrome-extension:' || 
      url.protocol === 'moz-extension:' || 
      url.protocol === 'safari-extension:' ||
      url.protocol === 'edge-extension:') {
    return;
  }
  
  // Ignorer les requêtes vers des domaines externes non autorisés
  if (!isAllowedDomain(url)) {
    return;
  }
  
  // Stratégie selon le type de ressource
  if (isImageRequest(url)) {
    event.respondWith(imageStrategy(request));
  } else if (isStaticResource(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirst(request));
  } else if (isPageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Fonctions utilitaires
function isAllowedDomain(url) {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'images.igdb.com',
    'checkpoint.local',
    'checkpoint.com'
  ];
  
  return allowedDomains.some(domain => url.hostname.includes(domain));
}

function isImageRequest(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
         url.hostname === 'images.igdb.com' ||
         url.pathname.startsWith('/api/proxy-image') ||
         url.pathname.startsWith('/images/');
}

function isStaticResource(url) {
  return url.pathname.startsWith('/images/') ||
         url.pathname.startsWith('/_next/static/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff2');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isPageRequest(url) {
  return url.pathname.startsWith('/games/') ||
         url.pathname === '/search' ||
         url.pathname === '/connexion' ||
         url.pathname === '/inscription';
}

// Stratégie spéciale pour les images
async function imageStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Si l'image est en cache, la retourner immédiatement
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Essayer de récupérer depuis le réseau
    const networkResponse = await fetch(request);
    
    // Ne mettre en cache que si la réponse est OK
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Erreur lors du chargement de l\'image:', error);
    
    // Retourner une image par défaut si disponible
    const cache = await caches.open(STATIC_CACHE);
    const defaultImage = await cache.match('/images/default-game-cover.png');
    
    if (defaultImage) {
      return defaultImage;
    }
    
    // Sinon, retourner une réponse d'erreur appropriée
    return new Response('Image non disponible', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stratégie Cache First
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Erreur cache first:', error);
    // Retourner une page d'erreur offline si disponible
    const cache = await caches.open(STATIC_CACHE);
    const offlineResponse = await cache.match('/offline');
    return offlineResponse || new Response('Ressource non disponible offline', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const cache = await caches.open(API_CACHE);
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Erreur réseau, utilisation du cache:', error);
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Retourner une réponse d'erreur appropriée
    return new Response('Service temporairement indisponible', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Toujours essayer de récupérer depuis le réseau
    const networkPromise = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch((error) => {
      console.warn('Erreur réseau, utilisation du cache:', error);
      return cachedResponse;
    });
    
    // Retourner le cache immédiatement si disponible
    return cachedResponse || networkPromise;
  } catch (error) {
    console.warn('Erreur stale while revalidate:', error);
    return new Response('Page temporairement indisponible', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
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