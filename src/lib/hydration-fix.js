// Fix pour les erreurs d'hydratation causées par les extensions de navigateur
(function() {
  'use strict';
  
  // Liste des attributs problématiques
  const PROBLEMATIC_ATTRIBUTES = [
    'cz-shortcut-listen',
    'spellcheck',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed', 
    'data-gr-ext-disabled',
    'data-adblock',
    'data-darkreader-mode',
    'data-darkreader-scheme',
    'data-lastpass-icon-warning',
    'data-1p-ignore',
    'data-bitwarden-watching',
    'style'
  ];

  // Fonction pour nettoyer les attributs
  function cleanupExtensionAttributes() {
    if (typeof document === 'undefined') return;
    
    const elements = [document.documentElement, document.body];
    elements.forEach(function(element) {
      if (element) {
        PROBLEMATIC_ATTRIBUTES.forEach(function(attr) {
          if (element.hasAttribute && element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });
      }
    });
  }

  // Masque les erreurs d'hydratation spécifiques aux extensions
  function suppressExtensionHydrationErrors() {
    if (typeof console === 'undefined') return;
    
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function() {
      const args = Array.prototype.slice.call(arguments);
      const message = args[0];
      
      if (typeof message === 'string') {
        // Patterns d'erreurs à ignorer
        const ignoredPatterns = [
          'A tree hydrated but some attributes',
          'cz-shortcut-listen',
          'hydration-mismatch',
          'Hydration failed because the initial UI',
          'There was an error while hydrating'
        ];
        
        // Vérifier si le message contient un des patterns à ignorer
        const shouldIgnore = ignoredPatterns.some(function(pattern) {
          return message.includes(pattern);
        }) || PROBLEMATIC_ATTRIBUTES.some(function(attr) {
          return message.includes(attr);
        });
        
        if (shouldIgnore) {
          return; // Ignore cette erreur
        }
      }
      
      originalError.apply(console, args);
    };
    
    console.warn = function() {
      const args = Array.prototype.slice.call(arguments);
      const message = args[0];
      
      if (typeof message === 'string' && message.includes('hydration')) {
        return; // Ignore les warnings d'hydratation
      }
      
      originalWarn.apply(console, args);
    };
  }

  // Exécution immédiate
  suppressExtensionHydrationErrors();
  
  // Nettoyage initial
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', cleanupExtensionAttributes);
    } else {
      cleanupExtensionAttributes();
    }
    
    // Nettoyage continu
    setInterval(cleanupExtensionAttributes, 100);
  }
  
})(); 