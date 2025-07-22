"use client";
import { useEffect } from 'react';

/**
 * Composant pour gérer la détection de la navigation au clavier
 * Ajoute une classe CSS quand l'utilisateur navigue au clavier
 */
const KeyboardNavigation: React.FC = () => {
  useEffect(() => {
    // Détecter la navigation au clavier
    const handleKeyDown = (e: KeyboardEvent) => {
      // Touches de navigation au clavier
      const navigationKeys = [
        'Tab',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Enter',
        'Space',
        'Escape'
      ];

      if (navigationKeys.includes(e.key)) {
        document.documentElement.classList.add('keyboard-navigation');
      }
    };

    // Détecter l'utilisation de la souris
    const handleMouseDown = () => {
      document.documentElement.classList.remove('keyboard-navigation');
    };

    // Détecter l'utilisation du trackpad/touch
    const handleTouchStart = () => {
      document.documentElement.classList.remove('keyboard-navigation');
    };

    // Écouter les événements
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart);

    // Nettoyer les écouteurs
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return null; // Ce composant ne rend rien visuellement
};

export default KeyboardNavigation; 