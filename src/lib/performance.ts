// Configuration des optimisations de performance

export const PERFORMANCE_CONFIG = {
  // Cache des données
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100, // Nombre maximum d'éléments en cache
  
  // Timeouts des requêtes
  API_TIMEOUT: 10000, // 10 secondes
  IMPORT_TIMEOUT: 15000, // 15 secondes pour l'import
  
  // Préchargement
  PRELOAD_PAGES: [
    '/search',
    '/connexion', 
    '/inscription',
    '/legal',
    '/games'
  ],
  
  // Images critiques
  CRITICAL_IMAGES: [
    '/images/Logo/Crystal.png',
    '/images/default-game-cover.png',
    '/images/Game/Default game.jpg'
  ],
  
  // Optimisations de navigation
  NAVIGATION_DEBOUNCE: 300, // ms
  SCROLL_THROTTLE: 16, // ~60fps
  
  // Surveillance des performances
  MEMORY_THRESHOLD: 0.8, // 80% d'utilisation mémoire
  CLEANUP_INTERVAL: 30000, // 30 secondes
};

// Fonction pour nettoyer le cache
export function cleanupCache(cache: Map<string, any>, maxSize: number = PERFORMANCE_CONFIG.MAX_CACHE_SIZE) {
  if (cache.size > maxSize) {
    const entries = Array.from(cache.entries());
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = sortedEntries.slice(0, cache.size - maxSize);
    
    toDelete.forEach(([key]) => cache.delete(key));
  }
}

// Fonction pour mesurer les performances
export function measurePerformance(name: string, fn: () => any) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} exécuté en ${(end - start).toFixed(2)}ms`);
  return result;
}

// Fonction pour optimiser les images
export function optimizeImage(src: string, width?: number, height?: number): string {
  if (!src) return src;
  
  // Si c'est une image IGDB, on peut optimiser
  if (src.includes('images.igdb.com')) {
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    return url.toString();
  }
  
  return src;
}

// Fonction pour précharger les ressources
export function preloadResource(href: string, as: 'image' | 'script' | 'style' | 'font' = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Fonction pour optimiser les polices
export function optimizeFonts() {
  // Précharger les polices critiques
  const fonts = [
    '/_next/static/media/geist-sans-var.woff2',
    '/_next/static/media/geist-mono-var.woff2'
  ];
  
  fonts.forEach(font => {
    preloadResource(font, 'font');
  });
}

// Fonction pour optimiser les images lazy loading
export function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Fonction pour optimiser le scroll
export function optimizeScroll() {
  let ticking = false;
  
  function updateScroll() {
    // Optimisations de scroll ici
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
}

// Fonction pour initialiser toutes les optimisations
export function initializePerformanceOptimizations() {
  // Optimiser les polices
  optimizeFonts();
  
  // Configurer le lazy loading
  if (typeof window !== 'undefined') {
    setupLazyLoading();
    optimizeScroll();
  }
  
  // Précharger les pages populaires
  PERFORMANCE_CONFIG.PRELOAD_PAGES.forEach(page => {
    preloadResource(page);
  });
  
  // Précharger les images critiques
  PERFORMANCE_CONFIG.CRITICAL_IMAGES.forEach(image => {
    preloadResource(image, 'image');
  });
} 