'use client';

import { useEffect } from 'react';

/**
 * Hook pour résoudre les problèmes d'hydratation causés par les extensions de navigateur
 * Supprime les attributs ajoutés par les extensions qui causent des conflits d'hydratation
 */
export const useHydrationFix = () => {
  useEffect(() => {
    // Liste des attributs problématiques ajoutés par les extensions
    const PROBLEMATIC_ATTRIBUTES = [
      'cz-shortcut-listen', // ColorZilla
      'spellcheck',
      'data-new-gr-c-s-check-loaded', // Grammarly
      'data-gr-ext-installed', // Grammarly
      'data-gr-ext-disabled', // Grammarly
      'data-adblock', // Bloqueurs de pub
      'data-darkreader-mode', // Dark Reader
      'data-darkreader-scheme', // Dark Reader
      'data-lastpass-icon-warning', // LastPass
      'data-1p-ignore', // 1Password
      'data-bitwarden-watching', // Bitwarden
    ];

    /**
     * Nettoie les attributs problématiques des éléments
     */
    const cleanupAttributes = () => {
      const elements = [document.documentElement, document.body];
      
      elements.forEach(element => {
        if (element) {
          PROBLEMATIC_ATTRIBUTES.forEach(attr => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          });
        }
      });
    };

    /**
     * Supprime les warnings d'hydratation spécifiques aux extensions
     */
    const suppressHydrationWarnings = () => {
      const originalError = console.error;
      
      console.error = (...args) => {
        const message = args[0];
        
        if (typeof message === 'string') {
          // Ignore les erreurs d'hydratation causées par les extensions
          const isHydrationExtensionError = 
            message.includes('A tree hydrated but some attributes') ||
            message.includes('cz-shortcut-listen') ||
            message.includes('hydration-mismatch') ||
            PROBLEMATIC_ATTRIBUTES.some(attr => message.includes(attr));
            
          if (isHydrationExtensionError) {
            return; // Ignore cette erreur
          }
        }
        
        // Affiche les autres erreurs normalement
        originalError(...args);
      };
      
      return originalError;
    };

    // Applique le nettoyage immédiatement
    cleanupAttributes();
    
    // Supprime les warnings d'hydratation
    const originalError = suppressHydrationWarnings();
    
    // Configure l'observer pour surveiller les changements futurs
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeName = mutation.attributeName;
          if (attributeName && PROBLEMATIC_ATTRIBUTES.includes(attributeName)) {
            shouldCleanup = true;
          }
        }
      });
      
      if (shouldCleanup) {
        cleanupAttributes();
      }
    });
    
    // Observe les changements sur html et body
    [document.documentElement, document.body].forEach(element => {
      if (element) {
        observer.observe(element, {
          attributes: true,
          attributeFilter: PROBLEMATIC_ATTRIBUTES,
        });
      }
    });
    
    // Nettoyage lors du démontage
    return () => {
      observer.disconnect();
      console.error = originalError;
    };
  }, []);
};

export default useHydrationFix; 