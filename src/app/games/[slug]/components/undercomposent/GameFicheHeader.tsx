import React from "react";
import "../styles/GameFicheHeader.scss";
import { getImageUrl } from "@/lib/imageUtils";

// Composant Donut SVG pour le rating
const DonutProgress: React.FC<{ value: number; size?: number; strokeWidth?: number }> = ({ 
  value, 
  size = 100, 
  strokeWidth = 15 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="donut-progress"
      style={{ display: "block", margin: "auto", transform: "rotate(-135deg)" }}
    >
      <circle
        className="donut-bg"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="transparent"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        className="donut-bar"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#game-fiche-header-donut-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
      <defs>
        <linearGradient id="game-fiche-header-donut-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#1976d2" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize={size * 0.18}
        fontWeight="bold"
        fill="#1976d2"
        style={{ transform: "rotate(135deg)", transformOrigin: "center" }}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

interface GameFicheHeaderProps {
  title: string;
  year?: number;
  studio?: string;
  developer?: string;
  coverUrl?: string;
  totalRating?: number;
}

export default function GameFicheHeader({ title, year, studio, developer, coverUrl, totalRating }: GameFicheHeaderProps) {
  // Nettoyer l'URL de l'image
  const cleanCoverUrl = getImageUrl(coverUrl);
  
  return (
    <div className="game-fiche-header">
      <div className="game-fiche-header__cover-container">
        <img 
          className="game-fiche-header__cover" 
          src={cleanCoverUrl} 
          alt={title} 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/placeholder-cover.jpg";
          }}
        />
      </div>
      <div className="game-fiche-header__content">
        <h1 className="game-fiche-header__title">
          {title} {year && <span>({year})</span>}
        </h1>
        <div className="game-fiche-header__subtitle">{studio || developer}</div>
      </div>
      <div className="game-fiche-header__rating">
        <DonutProgress value={totalRating || 90} size={100} strokeWidth={15} />
      </div>
    </div>
  );
} 