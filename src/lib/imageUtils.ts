/**
 * Utilitaires pour améliorer la qualité des images IGDB côté client
 */

/**
 * Nettoie une URL pour éviter les récursions de proxy et les protocoles dupliqués
 * @param url L'URL à nettoyer
 * @returns L'URL nettoyée
 */
export function cleanImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  // Supprimer les espaces et caractères invisibles
  let cleanUrl = url.trim();
  
  // Vérifier si c'est déjà une URL proxy malformée
  if (cleanUrl.includes('/api/proxy-image')) {
    // Extraire l'URL originale du paramètre
    const urlParam = new URLSearchParams(cleanUrl.split('?')[1]).get('url');
    if (urlParam) {
      cleanUrl = decodeURIComponent(urlParam);
    }
  }
  
  // Nettoyer les protocoles dupliqués avec gestion des deux points incorrects
  // Pattern 1: https://https:https:// -> https://
  cleanUrl = cleanUrl.replace(/^https?:\/\/https:https:\/\//g, 'https://');
  // Pattern 2: https://https:// -> https://
  cleanUrl = cleanUrl.replace(/^https?:\/\/https?:\/\//g, 'https://');
  // Pattern 3: https://http:// -> https://
  cleanUrl = cleanUrl.replace(/^https?:\/\/http:\/\//g, 'https://');
  // Pattern 4: http://https:// -> https://
  cleanUrl = cleanUrl.replace(/^http:\/\/https:\/\//g, 'https://');
  
  // S'assurer que l'URL a le bon format final
  if (cleanUrl.startsWith('//')) {
    cleanUrl = 'https:' + cleanUrl;
  } else if (!cleanUrl.match(/^https?:\/\//)) {
    cleanUrl = 'https://' + cleanUrl;
  }

  return cleanUrl;
}

/**
 * Améliore automatiquement la qualité d'une URL d'image IGDB
 * @param url - L'URL originale de l'image
 * @param size - La taille désirée (défaut: t_cover_big)
 * @returns L'URL avec une meilleure qualité
 */
export function improveIgdbImageQuality(url: string | null | undefined, size: string = 't_cover_big'): string {
  if (!url) {
    return '';
  }

  const cleanUrl = cleanImageUrl(url);
  
  // Si ce n'est pas une URL IGDB, retourner l'URL telle quelle
  if (!cleanUrl.includes('images.igdb.com')) {
    return cleanUrl;
  }

  // Vérifier si l'URL est déjà en haute qualité
  if (cleanUrl.includes('t_1080p') || cleanUrl.includes('t_original')) {
    return cleanUrl;
  }

  // Améliorer la qualité de l'image IGDB
  let improvedUrl = cleanUrl;
  
  // Remplacer les tailles par défaut par des tailles plus grandes
  improvedUrl = improvedUrl.replace(/t_thumb/g, 't_1080p');
  improvedUrl = improvedUrl.replace(/t_cover_small/g, 't_1080p');
  improvedUrl = improvedUrl.replace(/t_cover_big/g, 't_1080p');
  improvedUrl = improvedUrl.replace(/t_screenshot_med/g, 't_1080p');
  improvedUrl = improvedUrl.replace(/t_screenshot_huge/g, 't_1080p');
  improvedUrl = improvedUrl.replace(/t_screenshot_big/g, 't_1080p');

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
 * Transforme une URL IGDB en URL proxy pour éviter les problèmes CORS
 * @param url L'URL originale de l'image
 * @returns L'URL proxy ou l'URL originale si ce n'est pas une image IGDB
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  const cleanUrl = cleanImageUrl(url);
  
  // Si l'URL est vide après nettoyage, retourner une image par défaut
  if (!cleanUrl) {
    return '/images/placeholder-cover.jpg';
  }
  
  // Si c'est une URL locale ou déjà une URL proxy, la retourner telle quelle
  if (cleanUrl.startsWith('/') || cleanUrl.startsWith('data:') || cleanUrl.includes('/api/proxy-image')) {
    return cleanUrl;
  }

  // Si c'est une URL IGDB, la transformer en URL proxy
  if (cleanUrl.includes('images.igdb.com')) {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(cleanUrl)}`;
    return proxyUrl;
  }

  // Pour les autres URLs, les retourner telles quelles
  return cleanUrl;
}

/**
 * Vérifie si une URL est une image IGDB
 * @param url L'URL à vérifier
 * @returns true si c'est une image IGDB
 */
export function isIgdbImage(url?: string): boolean {
  return url ? url.includes('images.igdb.com') : false;
} 