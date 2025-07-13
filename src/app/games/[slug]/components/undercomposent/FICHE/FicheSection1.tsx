import React from "react";
import { Game } from "@/types/game";
import ColonneGaucheJeu from "./undercomposent/ColonneGaucheJeu";
import SynopsisEtTaxonomie from "./undercomposent/SynopsisEtTaxonomie";
import RadarChart from "./undercomposent/RadarChart";
import "./FicheSection1.scss";

interface FicheSection1Props {
  game: Game;
}

export default function FicheSection1({ game }: FicheSection1Props) {
  // Détecter si le synopsis est court
  const synopsisText = game.summary || "";
  const isShortSynopsis = synopsisText.length < 50 || synopsisText.includes("Chargement") || synopsisText.includes("Traduction");

  return (
    <div className="fiche-section1">
      <div className={`fiche-section1__layout ${isShortSynopsis ? 'fiche-section1__layout--short' : ''}`}>
        <ColonneGaucheJeu />
        <div className="fiche-section1__synopsis">
          <SynopsisEtTaxonomie game={game} />
        </div>
        <RadarChart ratings={game.detailedRatings || game.ratings || {}} className="fiche-section1__radar" />
      </div>
    </div>
  );
}
