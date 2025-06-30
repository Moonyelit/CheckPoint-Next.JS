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
    return cachedData;
  }

  // 2. Vérifier le cache mémoire
  const memoryCached = gameCache.get(slug);
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    return memoryCached.data;
  }

  try {
    // 3. Récupérer depuis la base de données avec un seul appel
    const response = await api.get(`/api/custom/games/${slug}`, {
      timeout: 3000, // Timeout réduit à 3 secondes
    });
    
    // Mettre en cache Redis (24h) et mémoire (10min)
    await GameCache.set(cacheKey, response.data);
    gameCache.set(slug, { data: response.data, timestamp: Date.now() });
    
    return response.data;
  } catch (error) {
    // 4. Si le jeu n'est pas trouvé, essayer l'import depuis IGDB avec plusieurs variantes
    if (error instanceof AxiosError && error.response?.status === 404) {
      // Générer plusieurs variantes du titre (incluant les chiffres romains)
      const titleVariants = generateTitleVariants(slug);
      
      for (const titleVariant of titleVariants) {
        try {
          const importResponse = await api.get(`/api/games/search-or-import/${encodeURIComponent(titleVariant)}`, {
            timeout: 5000, // Timeout réduit à 5 secondes
          });
            
          if (importResponse.data && Array.isArray(importResponse.data) && importResponse.data.length > 0) {
            // Prendre le premier jeu trouvé (le plus pertinent)
            const importedGame = importResponse.data[0];
            
            // Mettre en cache Redis (24h) et mémoire (10min)
            await GameCache.set(cacheKey, importedGame);
            gameCache.set(slug, { data: importedGame, timestamp: Date.now() });
                
            return importedGame;
          }
        } catch (importError) {
          // Continuer avec la variante suivante
        }
      }
    }
    
    notFound();
  }
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