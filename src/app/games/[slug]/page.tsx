import "./game.scss";
import GameTabs from "./components/GameTabs";
import RadarChart from "./components/RadarChart";

async function getGameData(slug: string) {
  // Les données sont actuellement en dur pour correspondre à la maquette.
  // Prochaine étape : les récupérer depuis une API.
  return {
    name: "Split Fiction",
    year: 2025,
    studio: "Hazelight Studios",
    coverUrl: "/Figma/Images/Game/SplitFiction.webp",
    backgroundUrl: "/Figma/Images/Game/header.jpg",
    synopsis: "Le nouveau jeu de Josef Fares et Hazelight Studios, les créateurs de A Way Out et It Takes Two. Tout comme ces précédents titres, Split Fiction se présente comme un jeu d'action-avanture pensé pour la coopération. Les joueurs incarnent ici Mio et Zoe, deux auteures rivales qui se voient transporter dans leurs propres mondes imaginaires, entre science-fiction et fantasy. Elles devront alors collaborer pour pouvoir revenir à la réalité.",
    platforms: ["Series X|S", "PC", "PS5"],
    genres: ["Plateforme", "Aventure", "Action", "Fantaisie", "Science-Fiction"],
    developer: "Hazelight Studios",
    playerPerspective: "Troisième personne",
    publisher: "Electronic Arts",
    gameModes: ["Multijoueur", "Coopératif"],
    igdbId: "325994",
    series: "0",
    titles: "SPLIT FICTION",
    releaseDates: [
      { platform: "PC", date: "06-03-2025" },
      { platform: "PS5", date: "06-03-2025" },
      { platform: "Series X|S", date: "06-03-2025" },
    ],
    ageRatings: {
      pegi: "/Figma/Images/PEGI/PEGI_16.png", // Chemin d'exemple
      esrb: "/Figma/Images/ESRB/ESRB_Teen.png", // Chemin d'exemple
    },
    stats: {
      ost: 80,
      maniabilite: 90,
      gameplay: 75,
      graphismes: 85,
      duree_de_vie: 70,
    }
  };
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
            <p>{game.synopsis}</p>
          </div>
          <div className="game-platforms">
            <h2>PLATEFORMES</h2>
            <div className="tags">
              {game.platforms.map(p => <span key={p} className="tag">{p}</span>)}
            </div>
          </div>
           <div className="game-genres">
            <div className="tags">
              {game.genres.map(g => <span key={g} className="tag tag-genre">{g}</span>)}
            </div>
          </div>
        </div>
        <div className="game-sidebar">
          <h2>ÉVALUATIONS</h2>
          <RadarChart stats={game.stats} />
        </div>
      </div>

      <div className="game-additional-info">
        <div className="info-section">
          <h3>INFORMATIONS</h3>
          <div className="info-grid">
            <div className="info-item"><span>Développeur</span><p>{game.developer}</p></div>
            <div className="info-item"><span>Vue Joueur</span><p>{game.playerPerspective}</p></div>
            <div className="info-item"><span>Éditeur</span><p>{game.publisher}</p></div>
            <div className="info-item"><span>Modes de jeu</span><p>{game.gameModes.join(', ')}</p></div>
            <div className="info-item"><span>IGDB ID</span><p>{game.igdbId}</p></div>
            <div className="info-item"><span>Séries</span><p>{game.series}</p></div>
            <div className="info-item"><span>Titres</span><p>{game.titles}</p></div>
          </div>
        </div>
        <div className="info-section">
          <h3>DATES DE SORTIES</h3>
          <div className="release-dates">
            {game.releaseDates.map(rd => <div key={rd.platform} className="release-date-item"><span>{rd.platform}</span><p>{rd.date}</p></div>)}
          </div>
        </div>
        <div className="info-section">
          <h3>CLASSIFICATION PAR ÂGE</h3>
          <div className="age-ratings">
            <img src={game.ageRatings.pegi} alt="PEGI rating" />
            <img src={game.ageRatings.esrb} alt="ESRB rating" />
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
          <img src={game.backgroundUrl} alt={`Background de ${game.name}`} />
        </div>
        <div className="game-header__content main-container">
          <div className="game-header__cover">
            <img src={game.coverUrl} alt={`Jaquette de ${game.name}`} />
          </div>
          <div className="game-header__info">
            <h1 className="game-header__title">{game.name} ({game.year})</h1>
            <p className="game-header__studio">{game.studio}</p>
          </div>
          <div className="game-header__score">
            {/* Le composant de score sera ajouté ici */}
          </div>
        </div>
      </header>
      
      <main className="main-container">
        <GameTabs game={game} ficheContent={FicheTabContent} />
      </main>
    </div>
  );
} 