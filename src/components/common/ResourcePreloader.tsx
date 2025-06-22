/**
 * ResourcePreloader - Optimiseur de performances
 * 
 * Ce composant génère des balises <link rel="preload"> pour précharger
 * les ressources critiques (images, fonts, etc.) en priorité.
 * 
 * Avantages :
 * - Améliore les Core Web Vitals (LCP, CLS)
 * - Évite les "flash" lors du chargement des images
 * - Réduit le temps de chargement perçu
 * - Optimise l'UX sans être visible pour l'utilisateur
 * 
 * Utilisation : <ResourcePreloader resources={[{href: "/image.png", as: "image"}]} />
 */

import React from 'react';

interface Resource {
  href: string;
  as: string;
}

interface ResourcePreloaderProps {
  resources: Resource[];
}

const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ resources }) => {
  return (
    <>
      {resources.map((resource, idx) => (
        <link
          key={idx}
          rel="preload"
          href={resource.href}
          as={resource.as}
        />
      ))}
    </>
  );
};

export default ResourcePreloader; 