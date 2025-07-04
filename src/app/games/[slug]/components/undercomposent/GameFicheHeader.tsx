import React from "react";
import "../styles/GameFicheHeader.scss";

interface GameFicheHeaderProps {
  title: string;
  year?: number;
  studio?: string;
  developer?: string;
}

export default function GameFicheHeader({ title, year, studio, developer }: GameFicheHeaderProps) {
  return (
    <div className="game-fiche-header">
      <h1 className="game-fiche-header__title">
        {title} {year && <span>({year})</span>}
      </h1>
      <div className="game-fiche-header__subtitle">{studio || developer}</div>
    </div>
  );
} 