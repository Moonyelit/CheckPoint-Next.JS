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

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Cache mémoire côté client (toujours disponible)
const memoryCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

// Cache Redis côté serveur (optionnel)
class ServerRedisCache {
  private isConnected: boolean = false;

  constructor() {
    // Initialiser seulement côté serveur
    if (typeof window === 'undefined') {
      this.init();
    }
  }

  private async init() {
    try {
      // Import dynamique côté serveur uniquement
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      this.isConnected = !!client;
      
      if (this.isConnected) {
        console.log('✅ Cache Redis initialisé (serveur)');
      } else {
        console.warn('⚠️ Cache Redis non disponible, utilisation du cache mémoire uniquement');
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors de l\'initialisation Redis:', error);
      this.isConnected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return null;
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return null;

      const cached = await client.get(key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Vérifier si le cache a expiré
      if (Date.now() - entry.timestamp > entry.ttl * 1000) {
        await this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du cache Redis:', error);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return;
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return;

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || 3600, // 1 heure par défaut
      };

      await client.setex(key, entry.ttl, JSON.stringify(entry));
    } catch (error) {
      console.error('Erreur lors de la mise en cache Redis:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return;
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return;

      await client.del(key);
    } catch (error) {
      console.error('Erreur lors de la suppression du cache Redis:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return;
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return;

      await client.flushdb();
      console.log('🗑️ Cache Redis vidé');
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache Redis:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return false;
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return false;

      const result = await client.exists(key);
      return result === 1;
    } catch {
      return false;
    }
  }

  async getStats(): Promise<{
    connected: boolean;
    memoryUsage?: number;
    keysCount?: number;
  }> {
    if (!this.isConnected || typeof window !== 'undefined') {
      return { connected: false };
    }

    try {
      const { getRedisClient } = await import('./redis');
      const client = await getRedisClient();
      if (!client) return { connected: false };

      const [memoryUsage, keysCount] = await Promise.all([
        client.memory('STATS').catch(() => 0),
        client.dbsize().catch(() => 0),
      ]);

      return {
        connected: true,
        memoryUsage: typeof memoryUsage === 'number' ? memoryUsage : 0,
        keysCount: typeof keysCount === 'number' ? keysCount : 0,
      };
    } catch {
      return { connected: false };
    }
  }
}

// Instance globale du cache serveur
const serverCache = new ServerRedisCache();

// Wrapper unifié pour le cache
export class GameCache {
  static async get<T>(key: string): Promise<T | null> {
    // Côté serveur : essayer Redis d'abord
    if (typeof window === 'undefined') {
      const redisData = await serverCache.get<T>(key);
      if (redisData) {
        console.log(`🎯 Cache Redis hit: ${key}`);
        return redisData;
      }
    }

    // Fallback vers le cache mémoire (côté client et serveur)
    const memoryData = memoryCache.get(key);
    if (memoryData && Date.now() - memoryData.timestamp < memoryData.ttl * 1000) {
      console.log(`🎯 Cache mémoire hit: ${key}`);
      return memoryData.data as T;
    }

    return null;
  }

  static async set<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
    // Côté serveur : mettre en cache Redis
    if (typeof window === 'undefined') {
      await serverCache.set(key, data, ttl);
    }

    // Mettre en cache mémoire aussi (pour la redondance)
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: Math.min(ttl, 600), // Cache mémoire limité à 10min max
    });

    // Nettoyer le cache mémoire si trop volumineux
    if (memoryCache.size > 1000) {
      const entries = Array.from(memoryCache.entries());
      entries.slice(0, 100).forEach(([key]) => memoryCache.delete(key));
    }

    console.log(`💾 Mis en cache: ${key} (TTL: ${ttl}s)`);
  }

  static async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') {
      await serverCache.delete(key);
    }
    memoryCache.delete(key);
    console.log(`🗑️ Supprimé du cache: ${key}`);
  }

  static async clear(): Promise<void> {
    if (typeof window === 'undefined') {
      await serverCache.clear();
    }
    memoryCache.clear();
    console.log('🗑️ Tous les caches vidés');
  }

  static generateKey(type: string, identifier: string): string {
    return `game:${type}:${identifier}`;
  }

  static async getStats(): Promise<{
    redis: {
      connected: boolean;
      memoryUsage?: number;
      keysCount?: number;
    };
    memory: {
      size: number;
      entries: number;
    };
  }> {
    const redisStats = typeof window === 'undefined' 
      ? await serverCache.getStats()
      : { connected: false };
    
    return {
      redis: redisStats,
      memory: {
        size: memoryCache.size,
        entries: memoryCache.size,
      },
    };
  }
}

// Utilitaires pour les clés de cache
export const CACHE_KEYS = {
  GAME_BY_SLUG: (slug: string) => GameCache.generateKey('slug', slug),
  GAME_BY_ID: (id: number) => GameCache.generateKey('id', id.toString()),
  SEARCH_RESULTS: (query: string) => GameCache.generateKey('search', query),
  POPULAR_GAMES: () => GameCache.generateKey('popular', 'list'),
  RECENT_GAMES: () => GameCache.generateKey('recent', 'list'),
  USER_PROFILE: (userId: number) => GameCache.generateKey('user', userId.toString()),
  USER_GAMES: (userId: number) => GameCache.generateKey('user_games', userId.toString()),
};

// Configuration des TTL par type de données
export const CACHE_TTL = {
  GAME_DATA: 24 * 60 * 60, // 24h - Les infos de jeux changent peu
  SEARCH_RESULTS: 60 * 60, // 1h - Les résultats de recherche
  USER_DATA: 30 * 60, // 30min - Données utilisateur
  POPULAR_GAMES: 6 * 60 * 60, // 6h - Jeux populaires
  API_RESPONSES: 15 * 60, // 15min - Réponses API
}; 