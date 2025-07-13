import React from "react";
import { Game } from "@/types/game";
import "./FicheSection3.scss";

interface FicheSection3Props {
  game: Game;
}

const FicheSection3: React.FC<FicheSection3Props> = ({ game }) => {
  return (
    <section className="fiche-section3">
      <h3 className="fiche-section3__title">INFORMATIONS</h3>
      <div className="fiche-section3__tiles">
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">DÉVELOPPEUR</div>
          <div className="fiche-section3__tile-value">{game.developer || game.studio || "-"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">VUE JOUEUR</div>
          <div className="fiche-section3__tile-value">{game.playerPerspective || (game.perspectives && game.perspectives.join(", ")) || "-"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">ÉDITEUR</div>
          <div className="fiche-section3__tile-value">{game.publisher || "-"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">MODES DE JEU</div>
          <div className="fiche-section3__tile-value">{game.gameModes && game.gameModes.length > 0 ? game.gameModes.join(", ") : "-"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">IGDB ID</div>
          <div className="fiche-section3__tile-value">{game.igdbId || "-"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">SÉRIES</div>
          <div className="fiche-section3__tile-value">{game.series && game.series.length > 0 ? game.series.join(", ") : "//"}</div>
        </div>
        <div className="fiche-section3__tile">
          <div className="fiche-section3__tile-label fiche-section3__tile-label--blue">TITRES</div>
          <div className="fiche-section3__tile-value">{game.alternativeTitles && game.alternativeTitles.length > 0 ? game.alternativeTitles.join(", ") : (game.titles || "-")}</div>
        </div>
      </div>
    </section>
  );
};

export default FicheSection3; 