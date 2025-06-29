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

/**
 * Utilitaires pour la gestion des images
 */

/**
 * Transforme une URL IGDB en URL proxy pour éviter les problèmes CORS
 * @param url L'URL originale de l'image
 * @returns L'URL proxy ou l'URL originale si ce n'est pas une image IGDB
 */
export function getImageUrl(url?: string): string {
  if (!url) return '';
  
  if (url.includes('images.igdb.com')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${apiUrl}/api/proxy/image?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}

/**
 * Vérifie si une URL est une image IGDB
 * @param url L'URL à vérifier
 * @returns true si c'est une image IGDB
 */
export function isIgdbImage(url?: string): boolean {
  return url ? url.includes('images.igdb.com') : false;
}

/**
 * Améliore la qualité d'une image IGDB en utilisant une taille plus grande
 * @param url L'URL originale
 * @param size La taille désirée (t_cover_big, t_1080p, etc.)
 * @returns L'URL améliorée
 */
export function improveImageQuality(url: string, size: string = 't_cover_big'): string {
  if (!isIgdbImage(url)) return url;
  
  // Remplace la taille dans l'URL IGDB
  const patterns = [
    /\/t_thumb\//,
    /\/t_micro\//,
    /\/t_cover_small\//,
    /\/t_screenshot_med\//,
    /\/t_cover_small_2x\//
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(url)) {
      return url.replace(pattern, `/${size}/`);
    }
  }
  
  // Si aucun pattern trouvé, ajoute la taille
  if (url.includes('.jpg')) {
    return url.replace('.jpg', `_${size}.jpg`);
  }
  
  return url;
} 