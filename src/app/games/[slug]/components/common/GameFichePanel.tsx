import React from "react";
import "./GameFichePanel.scss";

interface GameFichePanelProps {
  children: React.ReactNode;
}

export default function GameFichePanel({ children }: GameFichePanelProps) {
  return (
    <div className="game-fiche-panel-wrapper" role="region" aria-label="Panneau principal du jeu">
      <section className="game-fiche-panel">
        {children}
      </section>
    </div>
  );
} 