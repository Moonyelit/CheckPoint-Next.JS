import React from "react";
import "./GameFicheHeader.scss";
import { getImageUrl } from "@/lib/imageUtils";

// Composant Donut SVG pour le rating
const DonutProgress: React.FC<{ value: number; size?: number; strokeWidth?: number; responsive?: boolean }> = ({ 
  value, 
  size = 100, 
  strokeWidth = 15,
  responsive = false
}) => {
  // Ajuster la taille pour le format responsive
  const finalSize = responsive ? 60 : size;
  const finalStrokeWidth = responsive ? 8 : strokeWidth;
  
  const radius = (finalSize - finalStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={finalSize}
      height={finalSize}
      className="donut-progress"
      style={{ display: "block", margin: "auto", transform: "rotate(-135deg)" }}
    >
      <circle
        className="donut-bg"
        cx={finalSize / 2}
        cy={finalSize / 2}
        r={radius}
        stroke="transparent"
        strokeWidth={finalStrokeWidth}
        fill="none"
      />
      <circle
        className="donut-bar"
        cx={finalSize / 2}
        cy={finalSize / 2}
        r={radius}
        stroke="url(#game-fiche-header-donut-gradient)"
        strokeWidth={finalStrokeWidth}
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
        fontSize={finalSize * 0.18}
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
  
  // Détecter si on est en mode responsive (peut être amélioré avec un hook)
  const [isResponsive, setIsResponsive] = React.useState(false);
  
  React.useEffect(() => {
    const checkResponsive = () => {
      setIsResponsive(window.innerWidth <= 768);
    };
    
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);
  
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
      {totalRating && totalRating > 0 && (
        <div className="game-fiche-header__rating">
          <DonutProgress value={totalRating} size={100} strokeWidth={15} responsive={isResponsive} />
        </div>
      )}
    </div>
  );
} 