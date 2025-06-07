'use client';

import { useEffect } from 'react';

/**
 * 🎣 HOOK USEHYDRATIONFIX - NETTOYAGE REACT DES EXTENSIONS
 * =========================================================
 * 
 * PROBLÈME RÉSOLU : Extensions de navigateur qui ajoutent des attributs DOM
 * EXEMPLES : Grammarly, LastPass, AdBlock, Dark Reader, etc.
 * 
 * STRATÉGIE :
 * 1. 🧹 Nettoyage immédiat des attributs problématiques
 * 2. 🔇 Masquage des erreurs d'hydratation dans la console  
 * 3. 👁️ Surveillance continue avec MutationObserver
 * 4. 🧽 Nettoyage automatique au démontage du composant
 * 
 * UTILISATION : Appelé par le composant <HydrationFix />
 */
export const useHydrationFix = () => {
  useEffect(() => {
    // 📋 LISTE COMPLÈTE DES ATTRIBUTS PROBLÉMATIQUES DES EXTENSIONS
    // Ces attributs sont ajoutés automatiquement par les extensions et causent des erreurs d'hydratation
    const PROBLEMATIC_ATTRIBUTES = [
      'cz-shortcut-listen',           // 🎨 ColorZilla (pipette de couleur)
      'spellcheck',                   // ✍️ Correcteurs orthographiques génériques
      'data-new-gr-c-s-check-loaded', // ✅ Grammarly (vérification chargée)
      'data-gr-ext-installed',        // 📥 Grammarly (extension installée)
      'data-gr-ext-disabled',         // ⏸️ Grammarly (extension désactivée)
      'data-adblock',                 // 🚫 Bloqueurs de publicité (AdBlock, uBlock)
      'data-darkreader-mode',         // 🌙 Dark Reader (mode sombre activé)
      'data-darkreader-scheme',       // 🎨 Dark Reader (schéma de couleurs)
      'data-lastpass-icon-warning',   // 🔐 LastPass (avertissement icône)
      'data-1p-ignore',               // 🔑 1Password (ignorer ce champ)
      'data-bitwarden-watching',      // 👁️ Bitwarden (surveillance active)
    ];

    /**
     * 🧹 FONCTION DE NETTOYAGE DES ATTRIBUTS D'EXTENSIONS
     * Parcourt <html> et <body> pour supprimer tous les attributs problématiques
     */
    const cleanupAttributes = () => {
      // 🎯 Cible les éléments racines où les extensions injectent leurs attributs
      const elements = [document.documentElement, document.body];
      
      elements.forEach(element => {
        if (element) {
          PROBLEMATIC_ATTRIBUTES.forEach(attr => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr); // ❌ Supprime l'attribut d'extension
            }
          });
        }
      });
    };

    /**
     * 🔇 SUPPRESSION DES WARNINGS D'HYDRATATION DANS LA CONSOLE
     * Override console.error pour masquer les erreurs causées par les extensions
     */
    const suppressHydrationWarnings = () => {
      const originalError = console.error;
      
      console.error = (...args) => {
        const message = args[0];
        
        if (typeof message === 'string') {
          // 🔍 Détecte si l'erreur est causée par une extension de navigateur
          const isHydrationExtensionError = 
            message.includes('A tree hydrated but some attributes') ||  // Attributs en plus détectés
            message.includes('cz-shortcut-listen') ||                   // ColorZilla spécifique
            message.includes('hydration-mismatch') ||                   // Différence serveur/client
            PROBLEMATIC_ATTRIBUTES.some(attr => message.includes(attr)); // Attributs de notre liste
            
          if (isHydrationExtensionError) {
            return; // ⛔ Ignore cette erreur (extension, pas notre code)
          }
        }
        
        // ✅ Affiche les vraies erreurs (pas causées par les extensions)
        originalError(...args);
      };
      
      return originalError;
    };

    // 🚀 NETTOYAGE IMMÉDIAT AU MONTAGE DU COMPOSANT
    cleanupAttributes();
    
    // 🔇 ACTIVATION DU MASQUAGE DES ERREURS D'HYDRATATION
    const originalError = suppressHydrationWarnings();
    
    // 👁️ SURVEILLANCE CONTINUE AVEC MUTATIONOBSERVER
    // Détecte quand les extensions ajoutent de nouveaux attributs et nettoie immédiatement
    const observer = new MutationObserver((mutations) => {
      let shouldCleanup = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeName = mutation.attributeName;
          if (attributeName && PROBLEMATIC_ATTRIBUTES.includes(attributeName)) {
            shouldCleanup = true; // 🎯 Extension détectée, nettoyage nécessaire
          }
        }
      });
      
      if (shouldCleanup) {
        cleanupAttributes(); // 🧹 Nettoie dès qu'une extension ajoute un attribut
      }
    });
    
    // 🎯 CONFIGURATION DE LA SURVEILLANCE SUR LES ÉLÉMENTS RACINES
    // Surveille <html> et <body> car c'est là que les extensions injectent leurs attributs
    [document.documentElement, document.body].forEach(element => {
      if (element) {
        observer.observe(element, {
          attributes: true,                      // 👀 Surveille les changements d'attributs
          attributeFilter: PROBLEMATIC_ATTRIBUTES, // 🎯 Filtre uniquement nos attributs problématiques
        });
      }
    });
    
    // 🧽 NETTOYAGE LORS DU DÉMONTAGE DU COMPOSANT
    return () => {
      observer.disconnect();          // 🔌 Arrête la surveillance des mutations
      console.error = originalError;  // 🔄 Restaure console.error original
    };
  }, []);
};

export default useHydrationFix; 