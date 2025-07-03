import axios from 'axios'
import { GameCache, CACHE_KEYS } from './cache'

// Instance axios pour les appels API génériques
const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
})

// Types pour les résultats de recherche génériques
export interface SearchResults {
  games: unknown[]
  total: number
  page: number
  limit: number
}

/**
 * Invalide le cache pour un jeu spécifique
 */
export async function invalidateGameCache(slug: string): Promise<void> {
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug)
  await GameCache.delete(cacheKey)
}

/**
 * Invalide le cache de recherche
 */
export async function invalidateSearchCache(): Promise<void> {
  // Note: Cette fonction pourrait être améliorée pour invalider
  // toutes les clés de recherche avec un pattern
  // searchCache.clear();
}

// Export de l'instance axios pour les appels directs
export default apiInstance
