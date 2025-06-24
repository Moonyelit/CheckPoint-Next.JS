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
  firstScreenshotUrl?: string;
  synopsis?: string;
  playerPerspective?: string;
  publisher?: string;
  igdbId?: string;
  series?: string;
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