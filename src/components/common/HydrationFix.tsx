'use client';

import { useEffect } from 'react';

const HydrationFix = () => {
  useEffect(() => {
    // Supprime les attributs ajoutés par les extensions de navigateur
    // qui peuvent causer des erreurs d'hydratation
    const removeExtensionAttributes = () => {
      const body = document.body;
      
      // Supprime l'attribut cz-shortcut-listen ajouté par certaines extensions
      if (body.hasAttribute('cz-shortcut-listen')) {
        body.removeAttribute('cz-shortcut-listen');
      }
      
      // Supprime d'autres attributs potentiellement problématiques
      const problematicAttributes = [
        'spellcheck',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
      ];
      
      problematicAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // Exécute immédiatement après l'hydratation
    removeExtensionAttributes();
    
    // Observe les changements au cas où l'extension ajoute l'attribut plus tard
    const observer = new MutationObserver(() => {
      removeExtensionAttributes();
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['cz-shortcut-listen', 'spellcheck', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Ce composant ne rend rien
};

export default HydrationFix; 