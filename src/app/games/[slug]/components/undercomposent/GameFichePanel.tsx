import React from "react";
import "../styles/GameFichePanel.scss";

interface GameFichePanelProps {
  children: React.ReactNode;
}

export default function GameFichePanel({ children }: GameFichePanelProps) {
  return (
    <section className="game-fiche-panel">
      {children}
    </section>
  );
} 