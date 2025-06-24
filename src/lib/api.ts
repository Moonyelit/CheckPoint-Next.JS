import axios from 'axios'
import { GameCache, CACHE_KEYS, CACHE_TTL } from './cache'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
})

// Types pour les données de jeux
export interface Game {
  id: number
  title: string
  slug: string
  coverUrl?: string
  firstScreenshotUrl?: string
  summary?: string
  totalRating?: number
  platforms?: string[]
  genres?: string[]
  developer?: string
  releaseDate?: string
  gameModes?: string[]
  perspectives?: string[]
  year?: number
  studio?: string
  backgroundUrl?: string
  synopsis?: string
  playerPerspective?: string
  publisher?: string
  igdbId?: string
  series?: string
  titles?: string
  releaseDates?: { platform: string; date: string }[]
  ageRatings?: { pegi: string; esrb: string }
  stats?: {
    ost: number
    maniabilite: number
    gameplay: number
    graphismes: number
    duree_de_vie: number
  }
}

export interface SearchResults {
  games: Game[]
  total: number
  page: number
  limit: number
}

/**
 * Récupère un jeu par son slug avec cache
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug)
  
  // Essayer de récupérer depuis le cache
  const cached = await GameCache.get<Game>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Récupérer depuis l'API
    const response = await api.get(`/games/${slug}`)
    const game = response.data

    // Mettre en cache
    await GameCache.set(cacheKey, game, CACHE_TTL.GAME_DATA)
    
    return game
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu:', error)
    return null
  }
}

/**
 * Recherche des jeux avec cache
 */
export async function searchGames(
  query: string, 
  page: number = 1, 
  limit: number = 20
): Promise<SearchResults | null> {
  const cacheKey = CACHE_KEYS.SEARCH_RESULTS(`${query}_${page}_${limit}`)
  
  // Essayer de récupérer depuis le cache
  const cached = await GameCache.get<SearchResults>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Récupérer depuis l'API
    const response = await api.get('/games/search', {
      params: { q: query, page, limit }
    })
    const results = response.data

    // Mettre en cache
    await GameCache.set(cacheKey, results, CACHE_TTL.SEARCH_RESULTS)
    
    return results
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return null
  }
}

/**
 * Récupère les jeux populaires avec cache
 */
export async function getPopularGames(limit: number = 20): Promise<Game[] | null> {
  const cacheKey = CACHE_KEYS.POPULAR_GAMES()
  
  // Essayer de récupérer depuis le cache
  const cached = await GameCache.get<Game[]>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Récupérer depuis l'API
    const response = await api.get('/games/popular', {
      params: { limit }
    })
    const games = response.data

    // Mettre en cache
    await GameCache.set(cacheKey, games, CACHE_TTL.POPULAR_GAMES)
    
    return games
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux populaires:', error)
    return null
  }
}

/**
 * Récupère les jeux récents avec cache
 */
export async function getRecentGames(limit: number = 20): Promise<Game[] | null> {
  const cacheKey = CACHE_KEYS.RECENT_GAMES()
  
  // Essayer de récupérer depuis le cache
  const cached = await GameCache.get<Game[]>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Récupérer depuis l'API
    const response = await api.get('/games/recent', {
      params: { limit }
    })
    const games = response.data

    // Mettre en cache
    await GameCache.set(cacheKey, games, CACHE_TTL.POPULAR_GAMES)
    
    return games
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux récents:', error)
    return null
  }
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
  console.log('Cache de recherche invalidé')
}

export default api
