'use client';

import { useHydrationFix } from '@/hooks/useHydrationFix';

/**
 * Composant pour résoudre les problèmes d'hydratation causés par les extensions de navigateur
 * Utilise le hook useHydrationFix pour nettoyer les attributs problématiques
 */
const HydrationFix = () => {
  useHydrationFix();
  return null;
};

export default HydrationFix; 