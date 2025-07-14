import React from "react";
import { Game } from "@/types/game";
import { TabType } from "../undercomposent/FICHE/undercomposent/TabsNav";
import FicheSection1 from "../undercomposent/FICHE/FicheSection1";
import FicheSection2 from "../undercomposent/FICHE/FicheSection2";
import FicheSection3 from "../undercomposent/FICHE/FicheSection3";
import FicheSection4 from "../undercomposent/FICHE/FicheSection4";
import MediaSection1 from "../undercomposent/MEDIA/MediaSection1";
import MediaSection2 from "../undercomposent/MEDIA/MediaSection2";
import MediaSection3 from "../undercomposent/MEDIA/MediaSection3";
import MediaSection4 from "../undercomposent/MEDIA/MediaSection4";
import MediaSection5 from "../undercomposent/MEDIA/MediaSection5";
import "./TabContent.scss";

interface TabContentProps {
  activeTab: TabType;
  game: Game;
}

export default function TabContent({ activeTab, game }: TabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      /**********************************************************
      ************************* ONGLET FICHE *******************
      **********************************************************/
      case "fiche":
        return (
          <div className="tab-content tab-content--fiche">
            <FicheSection1 game={game} />
            <FicheSection2 game={game} />
            <FicheSection3 game={game} />
            <FicheSection4 game={game} />
          </div>
        );

      /**********************************************************
      ************************* ONGLET MEDIA *******************
      **********************************************************/
      case "media":
        return (
          <div className="tab-content tab-content--media">
            <div className="media-content__grid">
              <MediaSection1 game={game} />
              <MediaSection2 game={game} />
              <MediaSection3 game={game} />
              <MediaSection4 game={game} />
              <MediaSection5 game={game} />
              {!game.coverUrl && !game.firstScreenshotUrl && !game.artworks?.length && !game.trailerUrl && !game.videos?.length && (
                <p>Aucun média disponible pour ce jeu.</p>
              )}
            </div>
          </div>
        );

      /**********************************************************
      ************************* ONGLET CRITIQUES *******************
      **********************************************************/
      case "critiques":
        return (
          <div className="tab-content tab-content--critiques">
            <h3>Critiques</h3>
            <div className="critiques-content__section">
              <div className="critiques-content__item">
                <span className="critiques-content__item-label">Note globale:</span>
                <div className="critiques-content__item-value">
                  {game.totalRating ? `${game.totalRating}%` : "Non évalué"}
                </div>
              </div>
              {game.ratings && (
                <div className="critiques-content__detailed">
                  <h4 className="critiques-content__detailed-title">Notes détaillées</h4>
                  <div className="critiques-content__detailed-grid">
                    {/* Utilise les notes détaillées calculées par l'API si disponibles */}
                    {(game.detailedRatings || game.ratings)?.graphisme && (
                      <div className="critiques-content__detail">
                        <span className="critiques-content__detail-label">Graphisme:</span>
                        <div className="critiques-content__detail-bar">
                          <div className="critiques-content__detail-fill" style={{width: `${(game.detailedRatings || game.ratings)?.graphisme}%`}}></div>
                          <span className="critiques-content__detail-value">{(game.detailedRatings || game.ratings)?.graphisme}%</span>
                        </div>
                      </div>
                    )}
                    {(game.detailedRatings || game.ratings)?.gameplay && (
                      <div className="critiques-content__detail">
                        <span className="critiques-content__detail-label">Gameplay:</span>
                        <div className="critiques-content__detail-bar">
                          <div className="critiques-content__detail-fill" style={{width: `${(game.detailedRatings || game.ratings)?.gameplay}%`}}></div>
                          <span className="critiques-content__detail-value">{(game.detailedRatings || game.ratings)?.gameplay}%</span>
                        </div>
                      </div>
                    )}
                    {(game.detailedRatings || game.ratings)?.musique && (
                      <div className="critiques-content__detail">
                        <span className="critiques-content__detail-label">Musique:</span>
                        <div className="critiques-content__detail-bar">
                          <div className="critiques-content__detail-fill" style={{width: `${(game.detailedRatings || game.ratings)?.musique}%`}}></div>
                          <span className="critiques-content__detail-value">{(game.detailedRatings || game.ratings)?.musique}%</span>
                        </div>
                      </div>
                    )}
                    {(game.detailedRatings || game.ratings)?.histoire && (
                      <div className="critiques-content__detail">
                        <span className="critiques-content__detail-label">Histoire:</span>
                        <div className="critiques-content__detail-bar">
                          <div className="critiques-content__detail-fill" style={{width: `${(game.detailedRatings || game.ratings)?.histoire}%`}}></div>
                          <span className="critiques-content__detail-value">{(game.detailedRatings || game.ratings)?.histoire}%</span>
                        </div>
                      </div>
                    )}
                    {(game.detailedRatings || game.ratings)?.jouabilite && (
                      <div className="critiques-content__detail">
                        <span className="critiques-content__detail-label">Jouabilité:</span>
                        <div className="critiques-content__detail-bar">
                          <div className="critiques-content__detail-fill" style={{width: `${(game.detailedRatings || game.ratings)?.jouabilite}%`}}></div>
                          <span className="critiques-content__detail-value">{(game.detailedRatings || game.ratings)?.jouabilite}%</span>
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

      /**********************************************************
      ************************* ONGLET CHALLENGES *******************
      **********************************************************/
      case "challenges":
        return (
          <div className="tab-content tab-content--challenges">
            <h3>Challenges</h3>
            <div className="challenges-content__list">
              <p>Les challenges et achievements seront affichés ici.</p>
            </div>
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