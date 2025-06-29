import api from "@/lib/api";
import "./game.scss";
import GameTabs from "./components/GameTabs";
import GameHeader from "./components/GameHeader";
import GameFicheContent from "./components/GameFicheContent";
import GameContentSkeleton from "./components/GameContentSkeleton";
import { notFound } from "next/navigation";
import { AxiosError } from "axios";
import { Suspense } from "react";
import { Game } from "./types";
import { GameCache, CACHE_KEYS } from "@/lib/cache";

// Cache pour les données de jeu (fallback côté client)
const gameCache = new Map<string, { data: Game; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function getGameData(slug: string): Promise<Game> {
  const startTime = Date.now();
  
  // 1. Vérifier le cache Redis en premier
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug);
  const cachedData = await GameCache.get<Game>(cacheKey);
  
  if (cachedData) {
    console.log(`⚡ Cache hit pour ${slug} (${Date.now() - startTime}ms)`);
    return cachedData;
  }

  // 2. Vérifier le cache mémoire
  const memoryCached = gameCache.get(slug);
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    console.log(`⚡ Cache mémoire hit pour ${slug} (${Date.now() - startTime}ms)`);
    return memoryCached.data;
  }

  try {
    // 3. Récupérer depuis la base de données avec un seul appel
    console.log(`🔍 Recherche du jeu: ${slug}`);
    const response = await api.get(`/api/games/${slug}`, {
      timeout: 3000, // Timeout réduit à 3 secondes
    });
    
    // Mettre en cache Redis (24h) et mémoire (10min)
    await GameCache.set(cacheKey, response.data);
    gameCache.set(slug, { data: response.data, timestamp: Date.now() });
    
    console.log(`✅ Jeu trouvé: ${response.data.title} (${Date.now() - startTime}ms)`);
    return response.data;
  } catch (error) {
    // 4. Si le jeu n'est pas trouvé, essayer l'import depuis IGDB avec une seule tentative
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log(`🔄 Jeu non trouvé, tentative d'import IGDB: ${slug}`);
      
      try {
        // Une seule tentative d'import avec le titre le plus probable
        const titleVariant = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
          const importResponse = await api.get(`/api/games/search-or-import/${encodeURIComponent(titleVariant)}`, {
          timeout: 5000, // Timeout réduit à 5 secondes
          });
          
          if (importResponse.data && importResponse.data.length > 0) {
          // Prendre le premier jeu trouvé (le plus pertinent)
          const importedGame = importResponse.data[0];
          
              // Mettre en cache Redis (24h) et mémoire (10min)
              await GameCache.set(cacheKey, importedGame);
              gameCache.set(slug, { data: importedGame, timestamp: Date.now() });
              
          console.log(`✅ Jeu importé: ${importedGame.title} (${Date.now() - startTime}ms)`);
              return importedGame;
            }
        } catch (importError) {
        console.log(`❌ Échec de l'import IGDB pour ${slug}`);
      }
    }
    
    console.error("Failed to fetch game data:", error);
    notFound();
  }
}

// Fonction pour obtenir des variantes spécifiques pour certains jeux
function getSpecificVariants(slug: string): string[] {
  const variants: string[] = [];
  
  // Cas spéciaux pour des jeux connus
  const specialCases: { [key: string]: string[] } = {
    'pac-man-world': ['Pac-Man World', 'Pacman World', 'Pac Man World'],
    'ape-escape': ['Ape Escape', 'Ape\'s Escape', 'Apes Escape'],
    'suikoden-star-leap': ['Suikoden Star Leap', 'Suikoden: Star Leap'],
    'suikoden-i-hd-remaster-gate-rune-war': [
      'Suikoden I HD Remaster',
      'Suikoden I HD Remaster: Gate Rune War',
      'Suikoden I Remaster',
      'Suikoden I'
    ],
    'suikoden-ii-hd-remaster-dunan-unification-war': [
      'Suikoden II HD Remaster',
      'Suikoden II HD Remaster: Dunan Unification War',
      'Suikoden II Remaster',
      'Suikoden II'
    ],
    'project-zero-2-wii-edition': [
      'Project Zero 2 Wii Edition',
      'Fatal Frame II Wii Edition',
      'Fatal Frame 2 Wii Edition',
      'Project Zero 2'
    ],
    'spyro-reignited-trilogy': [
      'Spyro Reignited Trilogy',
      'Spyro: Reignited Trilogy',
      'Spyro Trilogy',
      'Spyro'
    ]
  };
  
  // Ajouter les variantes spécifiques si elles existent
  if (specialCases[slug]) {
    variants.push(...specialCases[slug]);
  }
  
  // Variantes génériques pour les jeux avec tirets
  if (slug.includes('-')) {
    // Version avec deux-points au lieu de tiret
    const colonVersion = slug.replace(/-/g, ': ');
    variants.push(colonVersion);
    
    // Version avec parenthèses
    const parts = slug.split('-');
    if (parts.length >= 2) {
      const parenthesesVersion = `${parts[0]} (${parts.slice(1).join(' ')})`;
      variants.push(parenthesesVersion);
    }
  }
  
  return variants;
}

// Fonction pour générer plusieurs variantes du titre à partir du slug
function generateTitleVariants(slug: string): string[] {
  const variants: string[] = [];
  
  // 1. Conversion basique (remplace les tirets par des espaces et capitalise)
  const basicTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  variants.push(basicTitle);
  
  // 2. Version avec chiffres romains pour les séries
  const romanNumerals = {
    'i': 'I', 'ii': 'II', 'iii': 'III', 'iv': 'IV', 'v': 'V',
    'vi': 'VI', 'vii': 'VII', 'viii': 'VIII', 'ix': 'IX', 'x': 'X'
  };
  
  let romanTitle = basicTitle;
  Object.entries(romanNumerals).forEach(([arabic, roman]) => {
    const regex = new RegExp(`${arabic}`, 'g');
    romanTitle = romanTitle.replace(regex, roman);
  });
  
  variants.push(romanTitle);
  
  return variants;
}

// Fonction pour trouver le meilleur match entre les jeux importés et le slug
function findBestMatch(games: Game[], slug: string): Game | null {
  let bestMatch: Game | null = null;
  let bestDistance = Infinity;

  for (const game of games) {
    const distance = levenshteinDistance(game.slug, slug);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = game;
    }
  }

  return bestMatch;
}

// Fonction pour calculer la distance de Levenshtein entre deux chaînes de caractères
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameData(params.slug);

  const FicheTabContent = (
    <GameFicheContent game={game} />
  );

  return (
    <div className="game-page">
      <GameHeader
        name={game.title}
        year={game.year || new Date().getFullYear()}
        studio={game.studio || game.developer || "Studio inconnu"}
        coverUrl={game.coverUrl || "/images/placeholder-cover.jpg"}
        backgroundUrl={game.backgroundUrl || game.coverUrl || "/placeholder-background.jpg"}
        totalRating={game.totalRating}
        firstScreenshotUrl={game.firstScreenshotUrl}
      />
      <main className="main-container">
        <Suspense fallback={<GameContentSkeleton />}>
          <GameTabs ficheContent={FicheTabContent} />
        </Suspense>
      </main>
    </div>
  );
}