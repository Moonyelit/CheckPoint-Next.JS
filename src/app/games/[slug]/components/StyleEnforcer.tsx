"use client";

import { useEffect } from 'react';

export default function StyleEnforcer() {
  useEffect(() => {
    // Force l'application des styles critiques
    const applyCriticalStyles = () => {
      const gameFicheContainer = document.querySelector('.game-fiche-container');
      if (gameFicheContainer) {
        // Applique les styles directement via JavaScript si nécessaire
        const computedStyle = window.getComputedStyle(gameFicheContainer);
        if (computedStyle.marginBlock === '0px') {
          gameFicheContainer.setAttribute('style', 'position: relative !important; margin-block: -38rem 3rem !important;');
        }
      }
    };

    // Applique immédiatement
    applyCriticalStyles();
    
    // Et après un délai pour s'assurer que tout est chargé
    const timer = setTimeout(applyCriticalStyles, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // Ce composant ne rend rien visuellement
} 