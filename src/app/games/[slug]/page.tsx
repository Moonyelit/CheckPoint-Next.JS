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
  
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug);
  const cachedData = await GameCache.get<Game>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const memoryCached = gameCache.get(slug);
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    return memoryCached.data;
  }

  try {
    console.log(`🔍 Recherche du jeu: ${slug}`);
    
    // 3. Récupérer depuis la base de données
    const response = await api.get(`/api/games/${slug}`, {
      timeout: 5000, // Timeout réduit à 5 secondes
    });
    
    // Mettre en cache Redis (24h) et mémoire (10min)
    await GameCache.set(cacheKey, response.data);
    gameCache.set(slug, { data: response.data, timestamp: Date.now() });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Jeu trouvé en DB: ${slug} (${duration}ms)`);
    return response.data;
  } catch (error) {
    // 4. Si le jeu n'est pas trouvé, essayer l'import depuis IGDB avec plusieurs variantes
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log(`⚠️ Jeu non trouvé avec le slug "${slug}", tentative d'import depuis IGDB...`);
      
      // Générer plusieurs variantes du titre pour améliorer les chances de correspondance
      const titleVariants = generateTitleVariants(slug);
      
      // Ajouter aussi le slug original comme variante
      titleVariants.unshift(slug);
      
      // Ajouter des variantes spécifiques pour certains jeux
      const specificVariants = getSpecificVariants(slug);
      titleVariants.unshift(...specificVariants);
      
      console.log(`🔍 Tentatives avec ${titleVariants.length} variantes:`, titleVariants);
      
      for (const titleVariant of titleVariants) {
        try {
          console.log(`🔍 Tentative avec le titre: "${titleVariant}"`);
          
          const importResponse = await api.get(`/api/games/search-or-import/${encodeURIComponent(titleVariant)}`, {
            timeout: 8000, // Timeout réduit à 8 secondes
          });
          
          if (importResponse.data && importResponse.data.length > 0) {
            // Chercher le jeu avec le slug exact ou le plus proche
            const importedGame = findBestMatch(importResponse.data, slug);
            if (importedGame) {
              // Mettre en cache Redis (24h) et mémoire (10min)
              await GameCache.set(cacheKey, importedGame);
              gameCache.set(slug, { data: importedGame, timestamp: Date.now() });
              
              const duration = Date.now() - startTime;
              console.log(`✅ Jeu importé depuis IGDB: ${slug} (${duration}ms)`);
              return importedGame;
            }
          }
        } catch (importError) {
          console.log(`❌ Échec avec le titre "${titleVariant}":`, importError);
          continue; // Essayer la variante suivante
        }
      }
      
      // Dernière tentative : recherche directe par slug dans la base
      try {
        console.log(`🔍 Dernière tentative : recherche directe par slug "${slug}"`);
        const directResponse = await api.get(`/api/games/search-local/${encodeURIComponent(slug)}`, {
          timeout: 5000,
        });
        
        if (directResponse.data && directResponse.data.games && directResponse.data.games.length > 0) {
          const directGame = directResponse.data.games.find((game: Game) => game.slug === slug);
          if (directGame) {
            await GameCache.set(cacheKey, directGame);
            gameCache.set(slug, { data: directGame, timestamp: Date.now() });
            
            const duration = Date.now() - startTime;
            console.log(`✅ Jeu trouvé par recherche directe: ${slug} (${duration}ms)`);
            return directGame;
          }
        }
      } catch (directError) {
        console.log(`❌ Échec de la recherche directe:`, directError);
      }
      
      console.error("❌ Aucune variante de titre n'a fonctionné pour l'import IGDB");
    }
    
    console.error("❌ Failed to fetch game data:", error);
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