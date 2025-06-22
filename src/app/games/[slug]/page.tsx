import api from "@/lib/api";
import "./game.scss";
import GameTabs from "./components/GameTabs";
import RadarChart from "./components/RadarChart";
import { notFound } from "next/navigation";
import { AxiosError } from "axios";

// Typage des données attendues de l'API
interface Game {
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
  // Propriétés pour l'affichage (à adapter selon les données disponibles)
  year?: number;
  studio?: string;
  backgroundUrl?: string;
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

async function getGameData(slug: string): Promise<Game> {
  try {
    // D'abord, on essaie de récupérer le jeu depuis notre base de données
    const response = await api.get(`/api/games/${slug}`);
    return response.data;
  } catch (error) {
    // Si le jeu n'est pas trouvé (404), on essaie de l'importer depuis IGDB
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log(`Jeu non trouvé avec le slug "${slug}", tentative d'import depuis IGDB...`);
      
      try {
        // On essaie d'importer le jeu depuis IGDB en utilisant le slug comme titre
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const importResponse = await api.get(`/api/games/search-or-import/${encodeURIComponent(title)}`);
        
        if (importResponse.data && importResponse.data.length > 0) {
          // On cherche le jeu importé avec le bon slug
          const importedGame = importResponse.data.find((game: Game) => game.slug === slug);
          if (importedGame) {
            return importedGame;
          }
        }
      } catch (importError) {
        console.error("Erreur lors de l'import depuis IGDB:", importError);
      }
    }
    
    console.error("Failed to fetch game data:", error);
    // Si le jeu n'est pas trouvé et ne peut pas être importé, on redirige vers la page 404
    notFound();
  }
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameData(params.slug);

  const FicheTabContent = (
    <>
      <div className="game-content">
        <div className="game-main-content">
          <div className="game-actions">
            <button className="btn btn-primary">Ajouter à ma collection</button>
            <div className="game-rating-stars">
              <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
            </div>
            <button className="btn btn-secondary">Ajouter à une liste</button>
          </div>
          <div className="game-synopsis">
            <h2>SYNOPSIS</h2>
            <p>{game.synopsis || game.summary || "Aucun synopsis disponible."}</p>
          </div>
          <div className="game-platforms">
            <h2>PLATEFORMES</h2>
            <div className="tags">
              {game.platforms?.map(p => <span key={p} className="tag">{p}</span>)}
            </div>
          </div>
           <div className="game-genres">
            <div className="tags">
              {game.genres?.map(g => <span key={g} className="tag tag-genre">{g}</span>)}
            </div>
          </div>
        </div>
        <div className="game-sidebar">
          <h2>ÉVALUATIONS</h2>
          {game.stats && <RadarChart stats={game.stats} />}
        </div>
      </div>

      <div className="game-additional-info">
        <div className="info-section">
          <h3>INFORMATIONS</h3>
          <div className="info-grid">
            <div className="info-item"><span>Développeur</span><p>{game.developer}</p></div>
            <div className="info-item"><span>Vue Joueur</span><p>{game.playerPerspective}</p></div>
            <div className="info-item"><span>Éditeur</span><p>{game.publisher}</p></div>
            <div className="info-item"><span>Modes de jeu</span><p>{game.gameModes?.join(', ')}</p></div>
            <div className="info-item"><span>IGDB ID</span><p>{game.igdbId}</p></div>
            <div className="info-item"><span>Séries</span><p>{game.series}</p></div>
            <div className="info-item"><span>Titres</span><p>{game.titles}</p></div>
          </div>
        </div>
        <div className="info-section">
          <h3>DATES DE SORTIES</h3>
          <div className="release-dates">
            {game.releaseDates?.map(rd => <div key={rd.platform} className="release-date-item"><span>{rd.platform}</span><p>{rd.date}</p></div>)}
          </div>
        </div>
        <div className="info-section">
          <h3>CLASSIFICATION PAR ÂGE</h3>
          <div className="age-ratings">
            <img src={game.ageRatings?.pegi} alt="PEGI rating" />
            <img src={game.ageRatings?.esrb} alt="ESRB rating" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="game-header__background">
          {/* Assurez-vous que le chemin est correct depuis la racine 'public' */}
          <img src={game.backgroundUrl} alt={`Background de ${game.title}`} />
        </div>
        <div className="game-header__content main-container">
          <div className="game-header__cover">
            <img src={game.coverUrl} alt={`Jaquette de ${game.title}`} />
          </div>
          <div className="game-header__info">
            <h1 className="game-header__title">{game.title} ({game.year})</h1>
            <p className="game-header__studio">{game.studio}</p>
          </div>
          <div className="game-header__score">
            {/* Le composant de score sera ajouté ici */}
          </div>
        </div>
      </header>
      
      <main className="main-container">
        <GameTabs ficheContent={FicheTabContent} />
      </main>
    </div>
  );
} 