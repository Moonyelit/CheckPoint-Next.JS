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
 */

// Système de cache mémoire uniquement

class MemoryCache {
  private cache: Record<string, any> = {};
  async get<T>(key: string): Promise<T | null> {
    return this.cache[key] ?? null;
  }
  async set<T>(key: string, value: T): Promise<void> {
    this.cache[key] = value;
  }
  async delete(key: string): Promise<void> {
    delete this.cache[key];
  }
  async clear(): Promise<void> {
    this.cache = {};
  }
}

export const GameCache = new MemoryCache();

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