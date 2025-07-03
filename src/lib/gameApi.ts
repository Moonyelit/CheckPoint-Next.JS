import axios from 'axios'
import { GameCache, CACHE_KEYS } from './cache'
import { Game } from '@/types/game'

// Instance axios dédiée aux jeux
const gameApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Cache pour les données de jeu (fallback côté client)
const gameCache = new Map<string, { data: Game; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

/**
 * Récupère un jeu par son slug avec cache
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  // 1. Vérifier le cache Redis en premier
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug)
  const cachedData = await GameCache.get<Game>(cacheKey)
  
  if (cachedData) {
    return cachedData
  }

  // 2. Vérifier le cache mémoire
  const memoryCached = gameCache.get(slug)
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    return memoryCached.data
  }

  try {
    // 3. Récupérer depuis la base de données
    const response = await gameApiInstance.get(`/api/custom/games/${slug}`, {
      timeout: 3000,
    })
    
    // Mettre en cache Redis et mémoire
    await GameCache.set(cacheKey, response.data)
    gameCache.set(slug, { data: response.data, timestamp: Date.now() })
    
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu:', error)
    return null
  }
}

/**
 * Recherche et importe un jeu depuis IGDB
 */
export async function searchAndImportGame(title: string): Promise<Game | null> {
  try {
    const response = await gameApiInstance.get(`/api/games/search-or-import/${encodeURIComponent(title)}`, {
      timeout: 5000,
    })
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]
    }
    
    return null
  } catch (error) {
    console.error('Erreur lors de la recherche/import du jeu:', error)
    return null
  }
}

// Export de l'instance pour les appels directs
export default gameApiInstance 