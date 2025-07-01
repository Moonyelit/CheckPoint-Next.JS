/**
 * Système de cache hybride : Redis côté serveur + Mémoire côté client
 * 
 * Ce module gère le cache des données de jeux pour améliorer
 * significativement les performances et réduire la charge serveur.
 * 
 * 🚀 AVANTAGES :
 * - Réduction drastique des temps de réponse
 * - Moins de requêtes vers la base de données
 * - Moins d'appels vers l'API IGDB
 * - Meilleure expérience utilisateur
 * 
 * 🛡️ PROTECTION :
 * - Limite de taille pour éviter l'accumulation infinie
 * - TTL automatique pour nettoyer les anciennes données
 * - Nettoyage intelligent en développement
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 30 * 60 * 1000) { // 30min par défaut
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    
    // Nettoyage automatique toutes les 5 minutes (seulement côté client)
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.cleanup();
      }, 5 * 60 * 1000);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée a expiré
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Nettoyer si on atteint la limite
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Nettoyer les entrées expirées
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Supprimer les entrées les plus anciennes
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Obtenir les statistiques du cache
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: `${this.cache.size}/${this.maxSize} (${Math.round((this.cache.size / this.maxSize) * 100)}%)`
    };
  }
}

// Cache avec limite de 100 entrées et TTL de 30 minutes
export const GameCache = new MemoryCache(100, 30 * 60 * 1000);

// Fonction utilitaire pour générer les clés de cache (remplace l'ancienne méthode statique)
export function generateCacheKey(type: string, identifier: string) {
  return `game:${type}:${identifier}`;
}

// Utilitaires pour les clés de cache
export const CACHE_KEYS = {
  GAME_BY_SLUG: (slug: string) => generateCacheKey('slug', slug),
  GAME_BY_ID: (id: number) => generateCacheKey('id', id.toString()),
  SEARCH_RESULTS: (query: string) => generateCacheKey('search', query),
  POPULAR_GAMES: () => generateCacheKey('popular', 'list'),
  RECENT_GAMES: () => generateCacheKey('recent', 'list'),
  USER_PROFILE: (userId: number) => generateCacheKey('user', userId.toString()),
  USER_GAMES: (userId: number) => generateCacheKey('user_games', userId.toString()),
};

// Configuration des TTL par type de données
export const CACHE_TTL = {
  GAME_DATA: 24 * 60 * 60, // 24h - Les infos de jeux changent peu
  SEARCH_RESULTS: 60 * 60, // 1h - Les résultats de recherche
  USER_DATA: 30 * 60, // 30min - Données utilisateur
  POPULAR_GAMES: 6 * 60 * 60, // 6h - Jeux populaires
  API_RESPONSES: 15 * 60, // 15min - Réponses API
}; 