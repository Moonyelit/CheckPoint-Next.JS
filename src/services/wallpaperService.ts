/**
 * 🎨 SERVICE DE GESTION DES WALLPAPERS
 * 
 * Ce service centralise toute la logique d'interaction avec l'API pour les wallpapers.
 * Il sert d'intermédiaire entre les composants React et le backend.
 * 
 * 📋 RÔLES PRINCIPAUX :
 * - Gestion des appels API pour les wallpapers
 * - Typage strict des données (interfaces TypeScript)
 * - Gestion de l'authentification (headers JWT)
 * - Centralisation de la logique métier
 * 
 * 🔄 WORKFLOW TYPIQUE :
 * 1. Le composant React (ex: Step6.tsx) appelle une méthode du service
 * 2. Le service fait l'appel API avec les bons headers
 * 3. Le service traite la réponse et gère les erreurs
 * 4. Le composant reçoit les données typées et les affiche
 * 
 * 💡 AVANTAGES :
 * - Séparation claire des responsabilités
 * - Code réutilisable dans différents composants
 * - Maintenance facilitée (logique API centralisée)
 * - Typage fort pour éviter les erreurs
 * 
 * 📱 UTILISATION DANS LES COMPOSANTS :
 * - Step6.tsx : Sélection des wallpapers lors de l'inscription
 * - Profile.tsx : Affichage du wallpaper aléatoire
 * - Settings.tsx : Gestion des wallpapers favoris
 */

interface Game {
  id: number;
  title: string;
  coverUrl: string;
  developer: string;
  genres: string[];
  totalRating: number;
}

interface Wallpaper {
  id: number;
  image: string;
  game: Game;
}

interface UserWallpaper {
  id: number;
  selectedAt: string;
  wallpaper: Wallpaper;
}

interface WallpaperResponse {
  wallpapers: Wallpaper[];
  total: number;
}

interface UserWallpaperResponse {
  userWallpapers: UserWallpaper[];
  total: number;
}

interface RandomWallpaperResponse {
  wallpaper: Wallpaper;
  isUserSelected: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class WallpaperService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Récupère tous les wallpapers disponibles
   */
  async getAllWallpapers(): Promise<WallpaperResponse> {
    const response = await fetch(`${API_BASE_URL}/api/wallpapers`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des wallpapers');
    }

    return response.json();
  }

  /**
   * Récupère les wallpapers sélectionnés par l'utilisateur connecté
   */
  async getMyWallpapers(): Promise<UserWallpaperResponse> {
    const response = await fetch(`${API_BASE_URL}/api/wallpapers/my-selection`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de vos wallpapers');
    }

    return response.json();
  }

  /**
   * Sélectionne un wallpaper
   */
  async selectWallpaper(wallpaperId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/wallpapers/${wallpaperId}/select`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la sélection du wallpaper');
    }
  }

  /**
   * Désélectionne un wallpaper
   */
  async unselectWallpaper(wallpaperId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/wallpapers/${wallpaperId}/unselect`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la désélection du wallpaper');
    }
  }

  /**
   * Récupère un wallpaper aléatoire (utilisé pour le profil)
   */
  async getRandomWallpaper(): Promise<RandomWallpaperResponse> {
    const response = await fetch(`${API_BASE_URL}/api/wallpapers/random`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du wallpaper aléatoire');
    }

    return response.json();
  }

  /**
   * Vérifie si un wallpaper est sélectionné par l'utilisateur
   */
  async isWallpaperSelected(wallpaperId: number): Promise<boolean> {
    try {
      const userWallpapers = await this.getMyWallpapers();
      return userWallpapers.userWallpapers.some(
        uw => uw.wallpaper.id === wallpaperId
      );
    } catch (error) {
      console.error('Erreur lors de la vérification du wallpaper:', error);
      return false;
    }
  }
}

export default new WallpaperService();
export type { Wallpaper, Game, UserWallpaper, WallpaperResponse, UserWallpaperResponse, RandomWallpaperResponse }; 