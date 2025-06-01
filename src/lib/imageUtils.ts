/**
 * Utilitaires pour améliorer la qualité des images IGDB côté client
 */

/**
 * Améliore automatiquement la qualité d'une URL d'image IGDB
 * @param url - L'URL originale de l'image
 * @param size - La taille désirée (défaut: t_cover_big)
 * @returns L'URL avec une meilleure qualité
 */
export function improveIgdbImageQuality(url: string, size: string = 't_cover_big'): string {
  if (!url || !url.includes('images.igdb.com')) {
    return url;
  }

  // Patterns des tailles de basse qualité à remplacer
  const lowQualityPatterns = [
    /t_thumb/g,
    /t_micro/g,
    /t_cover_small/g,
    /t_screenshot_med/g,
    /t_cover_small_2x/g
  ];

  // Vérifie si l'image est déjà en haute qualité
  const highQualityPatterns = ['t_cover_big', 't_1080p', 't_720p', 't_original'];
  const hasHighQuality = highQualityPatterns.some(pattern => url.includes(pattern));
  
  if (hasHighQuality) {
    return url; // Déjà en haute qualité
  }

  // Remplace les patterns de basse qualité
  let improvedUrl = url;
  lowQualityPatterns.forEach(pattern => {
    improvedUrl = improvedUrl.replace(pattern, size);
  });

  // Si aucun pattern trouvé, ajoute la taille à la fin
  if (improvedUrl === url && url.includes('.jpg')) {
    improvedUrl = url.replace('.jpg', `_${size}.jpg`);
  }

  return improvedUrl;
}

/**
 * Tailles d'images disponibles pour IGDB
 */
export const IGDB_IMAGE_SIZES = {
  THUMB: 't_thumb',           // 90x90 (très petite)
  COVER_SMALL: 't_cover_small',    // 90x128
  COVER_BIG: 't_cover_big',        // 264x374 (recommandé pour les couvertures)
  HD_720P: 't_720p',               // 1280x720
  FULL_HD: 't_1080p',              // 1920x1080 (recommandé pour les screenshots)
  ORIGINAL: 't_original'           // Taille originale
} as const;

/**
 * Hook React pour améliorer automatiquement les URLs d'images
 */
export function useOptimizedImageUrl(url: string, size?: string): string {
  if (!url) return '';
  return improveIgdbImageQuality(url, size);
} 