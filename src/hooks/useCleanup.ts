'use client';

import { useEffect } from 'react';

/**
 * Hook pour nettoyer automatiquement les ressources et éviter les fuites mémoire
 * 
 * Ce hook effectue plusieurs actions de nettoyage :
 * 1. Nettoie les caches locaux
 * 2. Force le garbage collector (si disponible)
 * 3. Nettoie les timers orphelins
 */
export function useCleanup() {
  useEffect(() => {
    // Fonction de nettoyage
    const cleanup = () => {
      // Nettoyer les caches
      if (typeof window !== 'undefined') {
        // Vider le cache du navigateur pour les images
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }

        // Forcer le garbage collector (Chrome uniquement)
        if ('gc' in window) {
          (window as any).gc();
        }

        // Nettoyer les timers orphelins
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = highestTimeoutId; i >= 0; i--) {
          clearTimeout(i);
        }

        const highestIntervalId = setInterval(() => {}, 0);
        for (let i = highestIntervalId; i >= 0; i--) {
          clearInterval(i);
        }
      }
    };

    // Nettoyer toutes les 30 secondes
    const interval = setInterval(cleanup, 30000);

    // Nettoyer au démontage
    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, []);
} 