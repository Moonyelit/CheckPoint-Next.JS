'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Hook pour optimiser les performances
 * - Debouncing des fonctions
 * - Throttling des événements
 * - Gestion de la mémoire
 * - Optimisation des re-renders
 */

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }) as T,
    [func, delay]
  );
}

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        func(...args);
        lastCall.current = now;
      } else {
        if (lastCallTimer.current) {
          clearTimeout(lastCallTimer.current);
        }
        lastCallTimer.current = setTimeout(() => {
          func(...args);
          lastCall.current = Date.now();
        }, delay - (now - lastCall.current));
      }
    }) as T,
    [func, delay]
  );
}

export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { observe, unobserve };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export function usePerformance() {
  const router = useRouter();
  const pathname = usePathname();
  const navigationStartTime = useRef<number>(0);
  const isNavigating = useRef<boolean>(false);

  // Optimisation de la navigation
  const navigateWithPerformance = useCallback((href: string) => {
    if (isNavigating.current) return; // Éviter les navigations multiples
    
    isNavigating.current = true;
    navigationStartTime.current = performance.now();
    
    // Précharger la page avant la navigation
    const preloadPage = async () => {
      try {
        await fetch(href, { method: 'HEAD' });
      } catch (error) {
        console.warn('Erreur lors du préchargement:', error);
      }
    };
    
    preloadPage();
    
    // Navigation avec mesure de performance
    router.push(href);
  }, [router]);

  // Mesure des performances de navigation
  useEffect(() => {
    if (navigationStartTime.current > 0) {
      const navigationTime = performance.now() - navigationStartTime.current;
      console.log(`Navigation vers ${pathname} terminée en ${navigationTime.toFixed(2)}ms`);
      
      // Reset pour la prochaine navigation
      navigationStartTime.current = 0;
      isNavigating.current = false;
    }
  }, [pathname]);

  // Optimisation du scroll
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Préchargement intelligent des pages
  const preloadPage = useCallback((href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  // Optimisation des images
  const preloadImage = useCallback((src: string) => {
    const img = new Image();
    img.src = src;
  }, []);

  // Nettoyage de la mémoire
  const cleanupMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.warn('Utilisation mémoire élevée détectée');
        // Forcer le garbage collection si disponible
        if (window.gc) {
          window.gc();
        }
      }
    }
  }, []);

  // Surveillance des performances
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Performance navigation:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            total: navEntry.loadEventEnd - navEntry.fetchStart,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, []);

  // Nettoyage périodique
  useEffect(() => {
    const interval = setInterval(cleanupMemory, 30000); // Toutes les 30 secondes
    return () => clearInterval(interval);
  }, [cleanupMemory]);

  return {
    navigateWithPerformance,
    scrollToTop,
    preloadPage,
    preloadImage,
    cleanupMemory,
    isNavigating: isNavigating.current,
  };
} 