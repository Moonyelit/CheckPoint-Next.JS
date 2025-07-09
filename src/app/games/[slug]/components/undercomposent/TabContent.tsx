import React from "react";
import { Game } from "@/types/game";
import { TabType } from "./TabsNav";
import SynopsisEtTaxonomie from "./SynopsisEtTaxonomie";

interface TabContentProps {
  activeTab: TabType;
  game: Game;
}

export default function TabContent({ activeTab, game }: TabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "fiche":
        return (
          <div className="tab-content fiche-content">
            <SynopsisEtTaxonomie game={game} />
            <div className="game-details">
              <h3>Détails du jeu</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Développeur:</span>
                  <span className="value">{game.developer || "Non spécifié"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Éditeur:</span>
                  <span className="value">{game.publisher || "Non spécifié"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Genre:</span>
                  <span className="value">{game.genres?.join(", ") || "Non spécifié"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Plateformes:</span>
                  <span className="value">{game.platforms?.join(", ") || "Non spécifié"}</span>
                </div>
                {game.series && game.series.length > 0 && (
                  <div className="detail-item">
                    <span className="label">Série:</span>
                    <span className="value">{game.series.join(", ")}</span>
                  </div>
                )}
                {game.ageRating && (
                  <div className="detail-item">
                    <span className="label">Classification:</span>
                    <span className="value">{game.ageRating}</span>
                  </div>
                )}
                {game.alternativeTitles && game.alternativeTitles.length > 0 && (
                  <div className="detail-item">
                    <span className="label">Titres alternatifs:</span>
                    <span className="value">{game.alternativeTitles.join(", ")}</span>
                  </div>
                )}
                {game.releaseDatesByPlatform && Object.keys(game.releaseDatesByPlatform).length > 0 && (
                  <div className="detail-item">
                    <span className="label">Dates de sortie par plateforme:</span>
                    <div className="value">
                      {Object.entries(game.releaseDatesByPlatform).map(([platform, date]) => (
                        <div key={platform} className="platform-date">
                          <strong>{platform}:</strong> {new Date(date).toLocaleDateString('fr-FR')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="tab-content media-content">
            <h3>Médias</h3>
            <div className="media-grid">
              {game.coverUrl && (
                <div className="media-item">
                  <h4>Couverture</h4>
                  <img 
                    src={game.coverUrl} 
                    alt="Couverture du jeu"
                    className="screenshot"
                  />
                </div>
              )}
              {game.firstScreenshotUrl && (
                <div className="media-item">
                  <h4>Premier Screenshot</h4>
                  <img 
                    src={game.firstScreenshotUrl} 
                    alt="Screenshot du jeu"
                    className="screenshot"
                  />
                </div>
              )}
              {game.artworks && game.artworks.length > 0 && (
                <div className="media-item">
                  <h4>Artworks ({game.artworks.length})</h4>
                  <div className="artworks-grid">
                    {game.artworks.map((artwork, index) => (
                      <img 
                        key={index}
                        src={artwork} 
                        alt={`Artwork ${index + 1}`}
                        className="artwork"
                      />
                    ))}
                  </div>
                </div>
              )}
              {game.trailerUrl && (
                <div className="media-item">
                  <h4>Trailer</h4>
                  <div className="video-container">
                    <iframe
                      src={game.trailerUrl.replace('watch?v=', 'embed/')}
                      title="Trailer du jeu"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              {game.videos && game.videos.length > 0 && (
                <div className="media-item">
                  <h4>Vidéos ({game.videos.length})</h4>
                  <div className="videos-grid">
                    {game.videos.map((video, index) => (
                      <div key={index} className="video-item">
                        <h5>{video.name}</h5>
                        <div className="video-container">
                          <iframe
                            src={video.url.replace('watch?v=', 'embed/')}
                            title={video.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!game.coverUrl && !game.firstScreenshotUrl && !game.artworks?.length && !game.trailerUrl && !game.videos?.length && (
                <p>Aucun média disponible pour ce jeu.</p>
              )}
            </div>
          </div>
        );

      case "critiques":
        return (
          <div className="tab-content critiques-content">
            <h3>Critiques</h3>
            <div className="rating-section">
              <div className="rating-item">
                <span className="rating-label">Note globale:</span>
                <div className="rating-value">
                  {game.totalRating ? `${game.totalRating}%` : "Non évalué"}
                </div>
              </div>
              {game.ratings && (
                <div className="detailed-ratings">
                  <h4>Notes détaillées</h4>
                  <div className="ratings-grid">
                    {game.ratings.graphisme && (
                      <div className="rating-detail">
                        <span className="rating-label">Graphisme:</span>
                        <div className="rating-bar">
                          <div className="rating-fill" style={{width: `${game.ratings.graphisme}%`}}></div>
                          <span className="rating-value">{game.ratings.graphisme}%</span>
                        </div>
                      </div>
                    )}
                    {game.ratings.gameplay && (
                      <div className="rating-detail">
                        <span className="rating-label">Gameplay:</span>
                        <div className="rating-bar">
                          <div className="rating-fill" style={{width: `${game.ratings.gameplay}%`}}></div>
                          <span className="rating-value">{game.ratings.gameplay}%</span>
                        </div>
                      </div>
                    )}
                    {game.ratings.musique && (
                      <div className="rating-detail">
                        <span className="rating-label">Musique:</span>
                        <div className="rating-bar">
                          <div className="rating-fill" style={{width: `${game.ratings.musique}%`}}></div>
                          <span className="rating-value">{game.ratings.musique}%</span>
                        </div>
                      </div>
                    )}
                    {game.ratings.histoire && (
                      <div className="rating-detail">
                        <span className="rating-label">Histoire:</span>
                        <div className="rating-bar">
                          <div className="rating-fill" style={{width: `${game.ratings.histoire}%`}}></div>
                          <span className="rating-value">{game.ratings.histoire}%</span>
                        </div>
                      </div>
                    )}
                    {game.ratings.jouabilite && (
                      <div className="rating-detail">
                        <span className="rating-label">Jouabilité:</span>
                        <div className="rating-bar">
                          <div className="rating-fill" style={{width: `${game.ratings.jouabilite}%`}}></div>
                          <span className="rating-value">{game.ratings.jouabilite}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <p>Les critiques détaillées seront affichées ici.</p>
          </div>
        );

      case "challenges":
        return (
          <div className="tab-content challenges-content">
            <h3>Challenges</h3>
            <p>Les challenges et achievements seront affichés ici.</p>
          </div>
        );

      default:
        return <div>Contenu non trouvé</div>;
    }
  };

  return (
    <div className="tab-content-wrapper">
      {renderContent()}
    </div>
  );
} 