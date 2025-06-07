'use client';

import { useHydrationFix } from '@/hooks/useHydrationFix';

/**
 * 🛠️ COMPOSANT HYDRATIONFIX - SOLUTION REACT POUR LES EXTENSIONS
 * ==============================================================
 * 
 * RÔLE : Alternative/Complément au script dans layout.tsx
 * APPROCHE : Utilise les hooks React pour nettoyer les attributs d'extensions
 * TIMING : S'exécute après le montage des composants React
 * 
 * DIFFÉRENCE AVEC LE SCRIPT :
 * - Script = Prévention immédiate (avant React)
 * - HydrationFix = Nettoyage React (après montage)
 * 
 * UTILISATION : Placé dans les layouts pour un nettoyage continu
 */
const HydrationFix = () => {
  useHydrationFix(); // 🎣 Hook qui fait tout le travail de nettoyage
  return null; // 👻 Composant invisible (pas de rendu)
};

export default HydrationFix; 