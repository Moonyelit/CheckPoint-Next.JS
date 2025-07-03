import axios from 'axios'
import { Game } from '@/types/game'

// Instance axios simple
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

/**
 * Récupère un jeu par son slug
 */
export async function getGameBySlug(slug: string): Promise<Game | null> {
  try {
    const response = await api.get(`/api/custom/games/${slug}`)
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
    const response = await api.get(`/api/games/search-or-import/${encodeURIComponent(title)}`)
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0]
    }
    
    return null
  } catch (error) {
    console.error('Erreur lors de la recherche/import du jeu:', error)
    return null
  }
} 