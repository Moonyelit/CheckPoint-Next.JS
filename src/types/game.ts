export interface Game {
  id: number;
  title: string;
  slug: string;
  coverUrl?: string;
  summary?: string;
  totalRating?: number;
  platforms?: string[];
  genres?: string[];
  developer?: string;
  releaseDate?: string;
  gameModes?: string[];
  perspectives?: string[];
  year?: number;
  studio?: string;
  backgroundUrl?: string;
  firstScreenshotUrl?: string | null;
  synopsis?: string;
  playerPerspective?: string;
  publisher?: string;
  igdbId?: string;
  series?: string[];
  alternativeTitles?: string[];
  releaseDatesByPlatform?: { [platform: string]: string };
  ageRating?: string;
  trailerUrl?: string;
  ratings?: {
    graphisme?: number;
    gameplay?: number;
    musique?: number;
    histoire?: number;
    jouabilite?: number;
  };
  artworks?: string[];
  videos?: {
    name: string;
    videoId: string;
    url: string;
  }[];
  // Propriétés existantes pour compatibilité
  titles?: string;
  releaseDates?: { platform: string; date: string }[];
  ageRatings?: { pegi: string; esrb: string };
  stats?: {
    ost: number;
    maniabilite: number;
    gameplay: number;
    graphismes: number;
    duree_de_vie: number;
  };
} 