import GameInfo from './GameInfo';
import GameSidebar from './GameSidebar';
import { Game } from '../types';
import './styles/GameFicheContent.scss';

interface GameFicheContentProps {
  game: Game;
}

export default function GameFicheContent({ game }: GameFicheContentProps) {
  return (
    <div className="game-fiche-content">
      <div className="game-fiche-content__main">
        <GameInfo
          synopsis={game.synopsis || game.summary}
          platforms={game.platforms}
          genres={game.genres}
          developer={game.developer}
          publisher={game.publisher}
          gameModes={game.gameModes}
          playerPerspective={game.playerPerspective || game.perspectives?.[0]}
          igdbId={game.igdbId}
          series={game.series}
          titles={game.titles}
          releaseDates={game.releaseDates}
          ageRatings={game.ageRatings}
        />
      </div>
      
      <div className="game-fiche-content__sidebar">
        <GameSidebar
          stats={game.stats}
          totalRating={game.totalRating}
        />
      </div>
    </div>
  );
} 