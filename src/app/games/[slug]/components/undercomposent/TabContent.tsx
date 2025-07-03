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
                  <img 
                    src={game.coverUrl} 
                    alt="Couverture du jeu"
                    className="screenshot"
                  />
                </div>
              )}
              {game.firstScreenshotUrl && (
                <div className="media-item">
                  <img 
                    src={game.firstScreenshotUrl} 
                    alt="Screenshot du jeu"
                    className="screenshot"
                  />
                </div>
              )}
              {!game.coverUrl && !game.firstScreenshotUrl && (
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