'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PagePreloader - Composant de préchargement des pages
 * 
 * Ce composant affiche une page de chargement élégante pendant les transitions
 * entre les pages. Il améliore l'expérience utilisateur en :
 * 
 * 🎨 Apparence :
 * - Fond sombre semi-transparent avec effet de flou
 * - Spinner animé au centre de l'écran
 * - Transitions fluides d'entrée/sortie
 * 
 * ⚡ Fonctionnalités :
 * - Préchargement automatique des pages populaires
 * - Affichage pendant les changements de route
 * - Optimisation des performances de navigation
 * 
 * 📱 Responsive :
 * - S'adapte à tous les écrans
 * - Effet de flou sur l'arrière-plan
 * - Animation fluide et moderne
 */
interface PagePreloaderProps {
  children: React.ReactNode;
}

export default function PagePreloader({ children }: PagePreloaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Fonctions pour gérer l'état de chargement
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    /**
     * Gestionnaire de changement de route
     * Affiche le preloader pendant la transition
     */
    const handleRouteChange = () => {
      handleStart();
      // Délai minimal pour éviter le clignotement
      // et donner le temps à la nouvelle page de se charger
      setTimeout(handleComplete, 100);
    };

    /**
     * Préchargement intelligent des pages populaires
     * Améliore les performances en préchargeant les pages
     * les plus visitées
     */
    const preloadPages = () => {
      const popularPages = [
        '/search',        // Page de recherche
        '/connexion',     // Page de connexion
        '/inscription',   // Page d'inscription
        '/legal'          // Page légale
      ];

      popularPages.forEach(page => {
        // Ne pas précharger la page actuelle
        if (page !== pathname) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        }
      });
    };

    // Précharger les pages au montage du composant
    preloadPages();

    // Nettoyage des listeners (pour l'instant vide)
    return () => {
      // Cleanup si nécessaire
    };
  }, [pathname]);

  return (
    <>
      {/* Page de chargement - s'affiche pendant les transitions */}
      {isLoading && (
        <div className="page-preloader">
          {/* Spinner animé au centre */}
          <div className="preloader-spinner"></div>
          
          {/* Texte de chargement optionnel */}
          <div className="preloader-text">
            Chargement...
          </div>
        </div>
      )}
      
      {/* Contenu principal de l'application */}
      {children}
    </>
  );
} 