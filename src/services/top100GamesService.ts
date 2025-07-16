export interface Top100Game {
  id: number;
  title: string;
  name: string;
  slug: string;
  totalRating: number;
  total_rating: number;
  totalRatingCount: number;
  total_rating_count: number;
  coverUrl?: string;
  cover?: { url: string };
  platforms: Array<{ name: string }>;
  genres: Array<{ name: string }>;
  gameModes?: Array<{ name: string }>;
  perspectives?: Array<{ name: string }>;
  releaseDate?: string;
  first_release_date?: number;
}

export interface Top100GamesResponse {
  games: Top100Game[];
  criteria: {
    minVotes: number;
    minRating: number;
    limit: number;
  };
  totalCount: number;
}

export interface Top100GamesCriteria {
  minVotes?: number;
  minRating?: number;
  limit?: number;
}

/**
 * Récupère le Top 100 des jeux avec critères configurables
 */
export const fetchTop100Games = async (
  criteria: Top100GamesCriteria = {}
): Promise<Top100GamesResponse> => {
  const {
    minVotes = 80,
    minRating = 75,
    limit = 100
  } = criteria;

  const params = new URLSearchParams({
    minVotes: minVotes.toString(),
    minRating: minRating.toString(),
    limit: limit.toString()
  });

  try {
    // URL vers votre API Symfony
    const response = await fetch(`http://localhost:8000/api/top_100_games?${params}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du Top 100:', error);
    throw new Error('Impossible de récupérer le Top 100 des jeux');
  }
};

/**
 * Récupère le Top 100 avec critères par défaut (jeux populaires)
 */
export const fetchPopularGames = async (): Promise<Top100GamesResponse> => {
  return fetchTop100Games({
    minVotes: 100,
    minRating: 75,
    limit: 100
  });
};

/**
 * Récupère le Top 100 avec critères stricts (jeux AAA)
 */
export const fetchAAAGames = async (): Promise<Top100GamesResponse> => {
  return fetchTop100Games({
    minVotes: 500,
    minRating: 85,
    limit: 25
  });
};

/**
 * Récupère le Top 100 avec critères très stricts (classiques)
 */
export const fetchClassicGames = async (): Promise<Top100GamesResponse> => {
  return fetchTop100Games({
    minVotes: 1000,
    minRating: 90,
    limit: 20
  });
}; 