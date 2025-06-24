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
import { GameCache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";

// Cache pour les données de jeu (fallback côté client)
const gameCache = new Map<string, { data: Game; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function getGameData(slug: string): Promise<Game> {
  const startTime = Date.now();
  
  // 1. Vérifier le cache Redis côté serveur
  const cacheKey = CACHE_KEYS.GAME_BY_SLUG(slug);
  const cachedData = await GameCache.get<Game>(cacheKey);
  
  if (cachedData) {
    const duration = Date.now() - startTime;
    console.log(`🎯 Cache Redis hit pour ${slug} (${duration}ms)`);
    return cachedData;
  }

  // 2. Vérifier le cache mémoire côté client
  const memoryCached = gameCache.get(slug);
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    const duration = Date.now() - startTime;
    console.log(`🎯 Cache mémoire hit pour ${slug} (${duration}ms)`);
    return memoryCached.data;
  }

  try {
    console.log(`🔍 Recherche du jeu: ${slug}`);
    
    // 3. Récupérer depuis la base de données
    const response = await api.get(`/api/games/${slug}`, {
      timeout: 5000, // Timeout réduit à 5 secondes
    });
    
    // Mettre en cache Redis (24h) et mémoire (10min)
    await GameCache.set(cacheKey, response.data, CACHE_TTL.GAME_DATA);
    gameCache.set(slug, { data: response.data, timestamp: Date.now() });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Jeu trouvé en DB: ${slug} (${duration}ms)`);
    return response.data;
  } catch (error) {
    // 4. Si le jeu n'est pas trouvé, essayer l'import depuis IGDB
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log(`⚠️ Jeu non trouvé avec le slug "${slug}", tentative d'import depuis IGDB...`);
      
      try {
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const importResponse = await api.get(`/api/games/search-or-import/${encodeURIComponent(title)}`, {
          timeout: 8000, // Timeout réduit à 8 secondes
        });
        
        if (importResponse.data && importResponse.data.length > 0) {
          const importedGame = importResponse.data.find((game: Game) => game.slug === slug);
          if (importedGame) {
            // Mettre en cache Redis (24h) et mémoire (10min)
            await GameCache.set(cacheKey, importedGame, CACHE_TTL.GAME_DATA);
            gameCache.set(slug, { data: importedGame, timestamp: Date.now() });
            
            const duration = Date.now() - startTime;
            console.log(`✅ Jeu importé depuis IGDB: ${slug} (${duration}ms)`);
            return importedGame;
          }
        }
      } catch (importError) {
        console.error("❌ Erreur lors de l'import depuis IGDB:", importError);
      }
    }
    
    console.error("❌ Failed to fetch game data:", error);
    notFound();
  }
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
        coverUrl={game.coverUrl || "/placeholder-cover.jpg"}
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