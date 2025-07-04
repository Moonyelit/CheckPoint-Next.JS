"use client";

import React, { useState } from "react";
import { Game } from "@/types/game";
import GameFichePanel from "./undercomposent/GameFichePanel";
import ColonneGaucheJeu from "./undercomposent/ColonneGaucheJeu";
import GameFicheHeader from "./undercomposent/GameFicheHeader";
import TabsNav, { TabType } from "./undercomposent/TabsNav";
import TabContent from "./undercomposent/TabContent";

interface GameContenuProps {
  game: Game;
}

export default function GameContenu({ game }: GameContenuProps) {
  const [activeTab, setActiveTab] = useState<TabType>("fiche");

  return (
    <div className="game-contenu-wrapper">
      <div className="game-header-content">
        <GameFicheHeader
          title={game.title}
          year={game.year}
          studio={game.studio || game.developer}
        />
      </div>
      <GameFichePanel>
        <ColonneGaucheJeu game={game} />
        <div className="game-main-content">
          <div className="game-rating-section">
            <div className="rating-spacer" />
            <div className="rating-display">
              <CamembertIGDB note={game.totalRating || 90} />
            </div>
          </div>
          <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} game={game} />
        </div>
      </GameFichePanel>
    </div>
  );
}

function CamembertIGDB({ note }: { note?: number }) {
  return <div className="camembert-igdb">{note ? `${note}%` : "--"}</div>;
}
