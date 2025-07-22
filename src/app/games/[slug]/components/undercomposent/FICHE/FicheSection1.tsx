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
    <section className="fiche-section1" aria-label="Informations principales du jeu">
      <div className={`fiche-section1__layout ${isShortSynopsis ? 'fiche-section1__layout--short' : ''}`}>
        <ColonneGaucheJeu />
        <div className="fiche-section1__synopsis" role="region" aria-label="Synopsis et taxonomie du jeu">
          <SynopsisEtTaxonomie game={game} />
        </div>
        <div className="fiche-section1__radar" role="region" aria-label="Graphique des évaluations détaillées">
          <RadarChart ratings={game.detailedRatings || game.ratings || {}} className="fiche-section1__radar" />
        </div>
      </div>
    </section>
  );
}
