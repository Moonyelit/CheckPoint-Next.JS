import React from "react";
import "./GameFichePanel.scss";

interface GameFichePanelProps {
  children: React.ReactNode;
}

export default function GameFichePanel({ children }: GameFichePanelProps) {
  return (
    <div className="game-fiche-panel-wrapper">
      <section className="game-fiche-panel">
        {children}
      </section>
    </div>
  );
} 