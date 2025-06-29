/**
 * Utilitaires pour améliorer la qualité des images IGDB côté client
 */

/**
 * Nettoie une URL pour éviter les récursions de proxy
 * @param url L'URL à nettoyer
 * @returns L'URL nettoyée
 */
export function cleanImageUrl(url: string): string {
  if (!url) return '';
  
  // Décoder l'URL
  let cleanUrl = url;
  try {
    cleanUrl = decodeURIComponent(url);
  } catch {
    cleanUrl = url;
  }
  
  // Si l'URL contient déjà notre proxy, extraire l'URL originale
  const proxyPatterns = [
    /http:\/\/127\.0\.0\.1:8000\/api\/proxy\/image\?url=(.+)/,
    /http:\/\/localhost:8000\/api\/proxy\/image\?url=(.+)/,
    /https:\/\/127\.0\.0\.1:8000\/api\/proxy\/image\?url=(.+)/,
    /https:\/\/localhost:8000\/api\/proxy\/image\?url=(.+)/
  ];
  
  for (const pattern of proxyPatterns) {
    const match = cleanUrl.match(pattern);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  
  return cleanUrl;
}

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

  // Nettoyer l'URL d'abord
  const cleanUrl = cleanImageUrl(url);

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
  const hasHighQuality = highQualityPatterns.some(pattern => cleanUrl.includes(pattern));
  
  if (hasHighQuality) {
    return cleanUrl; // Déjà en haute qualité
  }

  // Remplace les patterns de basse qualité
  let improvedUrl = cleanUrl;
  lowQualityPatterns.forEach(pattern => {
    improvedUrl = improvedUrl.replace(pattern, size);
  });

  // Si aucun pattern trouvé, ajoute la taille à la fin
  if (improvedUrl === cleanUrl && cleanUrl.includes('.jpg')) {
    improvedUrl = cleanUrl.replace('.jpg', `_${size}.jpg`);
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
 * Transforme une URL IGDB en URL proxy pour éviter les problèmes CORS
 * @param url L'URL originale de l'image
 * @returns L'URL proxy ou l'URL originale si ce n'est pas une image IGDB
 */
export function getImageUrl(url?: string): string {
  if (!url) return '';

  try {
    // Nettoyer l'URL d'abord pour éviter les récursions
    const cleanUrl = cleanImageUrl(url);

    // Vérifier si c'est déjà une URL proxy pour éviter la récursion
    if (cleanUrl.includes('/api/proxy/image?url=') || 
        cleanUrl.includes('127.0.0.1:8000/api/proxy/image') ||
        cleanUrl.includes('localhost:8000/api/proxy/image')) {
      return cleanUrl;
    }

    // Vérifier si c'est une URL locale (déjà sur notre serveur)
    if (cleanUrl.startsWith('/') || 
        cleanUrl.startsWith('http://localhost') || 
        cleanUrl.startsWith('http://127.0.0.1') ||
        cleanUrl.startsWith('https://localhost') ||
        cleanUrl.startsWith('https://127.0.0.1')) {
      return cleanUrl;
    }

    // Si c'est une image IGDB, utiliser le proxy
    if (cleanUrl.includes('images.igdb.com')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const encodedUrl = encodeURIComponent(cleanUrl);
      return `${apiUrl}/api/proxy/image?url=${encodedUrl}`;
    }

    return cleanUrl;
  } catch (error) {
    console.error('Erreur lors du traitement de l\'URL:', error, 'URL:', url);
    return url || '';
  }
}

/**
 * Vérifie si une URL est une image IGDB
 * @param url L'URL à vérifier
 * @returns true si c'est une image IGDB
 */
export function isIgdbImage(url?: string): boolean {
  return url ? url.includes('images.igdb.com') : false;
} 