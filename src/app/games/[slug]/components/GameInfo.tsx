import './styles/GameInfo.scss';

interface GameInfoProps {
  synopsis?: string;
  platforms?: string[];
  genres?: string[];
  developer?: string;
  publisher?: string;
  gameModes?: string[];
  playerPerspective?: string;
  igdbId?: string;
  series?: string;
  titles?: string;
  releaseDates?: { platform: string; date: string }[];
  ageRatings?: { pegi: string; esrb: string };
}

export default function GameInfo({
  synopsis,
  platforms,
  genres,
  developer,
  publisher,
  gameModes,
  playerPerspective,
  igdbId,
  series,
  titles,
  releaseDates,
  ageRatings
}: GameInfoProps) {
  return (
    <div className="game-info">
      <div className="game-info__main">
        <div className="game-info__synopsis">
          <h2 className="game-info__section-title">SYNOPSIS</h2>
          <p className="game-info__synopsis-text">
            {synopsis || "Aucun synopsis disponible pour ce jeu."}
          </p>
        </div>

        <div className="game-info__platforms">
          <h2 className="game-info__section-title">PLATEFORMES</h2>
          <div className="game-info__tags">
            {platforms?.map(platform => (
              <span key={platform} className="game-info__tag game-info__tag--platform">
                {platform}
              </span>
            )) || <span className="game-info__no-data">Aucune plateforme renseignée</span>}
          </div>
        </div>

        <div className="game-info__genres">
          <h2 className="game-info__section-title">GENRES</h2>
          <div className="game-info__tags">
            {genres?.map(genre => (
              <span key={genre} className="game-info__tag game-info__tag--genre">
                {genre}
              </span>
            )) || <span className="game-info__no-data">Aucun genre renseigné</span>}
          </div>
        </div>
      </div>

      <div className="game-info__additional">
        <div className="game-info__section">
          <h3 className="game-info__section-title">INFORMATIONS</h3>
          <div className="game-info__grid">
            {developer && (
              <div className="game-info__item">
                <span className="game-info__label">Développeur</span>
                <p className="game-info__value">{developer}</p>
              </div>
            )}
            {publisher && (
              <div className="game-info__item">
                <span className="game-info__label">Éditeur</span>
                <p className="game-info__value">{publisher}</p>
              </div>
            )}
            {playerPerspective && (
              <div className="game-info__item">
                <span className="game-info__label">Vue Joueur</span>
                <p className="game-info__value">{playerPerspective}</p>
              </div>
            )}
            {gameModes && gameModes.length > 0 && (
              <div className="game-info__item">
                <span className="game-info__label">Modes de jeu</span>
                <p className="game-info__value">{gameModes.join(', ')}</p>
              </div>
            )}
            {igdbId && (
              <div className="game-info__item">
                <span className="game-info__label">IGDB ID</span>
                <p className="game-info__value">{igdbId}</p>
              </div>
            )}
            {series && (
              <div className="game-info__item">
                <span className="game-info__label">Séries</span>
                <p className="game-info__value">{series}</p>
              </div>
            )}
            {titles && (
              <div className="game-info__item">
                <span className="game-info__label">Titres</span>
                <p className="game-info__value">{titles}</p>
              </div>
            )}
          </div>
        </div>

        {releaseDates && releaseDates.length > 0 && (
          <div className="game-info__section">
            <h3 className="game-info__section-title">DATES DE SORTIES</h3>
            <div className="game-info__release-dates">
              {releaseDates.map((releaseDate, index) => (
                <div key={index} className="game-info__release-item">
                  <span className="game-info__release-platform">{releaseDate.platform}</span>
                  <p className="game-info__release-date">{releaseDate.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {ageRatings && (
          <div className="game-info__section">
            <h3 className="game-info__section-title">CLASSIFICATION PAR ÂGE</h3>
            <div className="game-info__age-ratings">
              {ageRatings.pegi && (
                <img 
                  src={ageRatings.pegi} 
                  alt="PEGI rating" 
                  className="game-info__rating-image"
                />
              )}
              {ageRatings.esrb && (
                <img 
                  src={ageRatings.esrb} 
                  alt="ESRB rating" 
                  className="game-info__rating-image"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 