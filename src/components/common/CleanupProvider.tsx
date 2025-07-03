'use client';

import { useCleanup } from '@/hooks/useCleanup';

export default function CleanupProvider() {
  // Utilise le hook de nettoyage automatique
  useCleanup();
  
  // Ce composant ne rend rien visuellement
  return null;
} 