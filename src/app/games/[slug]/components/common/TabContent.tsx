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
import CritiquesSection1 from "../undercomposent/CRITIQUES/CritiquesSection1";
import ChallengesSection1 from "../undercomposent/CHALLENGES/ChallengesSection1";
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
          <div 
            className="tab-content tab-content--fiche"
            role="tabpanel"
            id="tabpanel-fiche"
            aria-labelledby="tab-fiche"
            aria-label="Informations détaillées du jeu"
          >
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
          <div 
            className="tab-content tab-content--media"
            role="tabpanel"
            id="tabpanel-media"
            aria-labelledby="tab-media"
            aria-label="Médias du jeu"
          >
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
          <div 
            className="tab-content tab-content--critiques"
            role="tabpanel"
            id="tabpanel-critiques"
            aria-labelledby="tab-critiques"
            aria-label="Critiques du jeu"
          >
            <CritiquesSection1 />
          </div>
        );

      /**********************************************************
      ************************* ONGLET CHALLENGES *******************
      **********************************************************/
      case "challenges":
        return (
          <div 
            className="tab-content tab-content--challenges"
            role="tabpanel"
            id="tabpanel-challenges"
            aria-labelledby="tab-challenges"
            aria-label="Challenges du jeu"
          >
            <ChallengesSection1 />
          </div>
        );

      default:
        return <div>Contenu non trouvé</div>;
    }
  };

  return (
    <div className="tab-content-wrapper" role="region" aria-label="Contenu de l'onglet actif">
      {renderContent()}
    </div>
  );
} 