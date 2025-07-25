"use client";

import React, { useState } from "react";
import { Game } from "@/types/game";
import GameFichePanel from "../../../common/GameFichePanel";
import GameFicheHeader from "../../../common/GameFicheHeader";
import TabsNav, { TabType } from "./TabsNav";
import TabContent from "../../../common/TabContent";

interface GameContenuProps {
  game: Game;
}

export default function GameContenu({ game }: GameContenuProps) {
  const [activeTab, setActiveTab] = useState<TabType>("fiche");

  return (
    <div className="game-contenu">
      <div className="game-contenu__header">
        <GameFicheHeader
          title={game.title}
          year={game.year}
          studio={game.studio || game.developer}
          coverUrl={game.coverUrl}
          totalRating={game.totalRating}
        />
      </div>
      <GameFichePanel>
        <div className="game-contenu__main">
          <TabsNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <TabContent activeTab={activeTab} game={game} />
        </div>
      </GameFichePanel>
    </div>
  );
}
