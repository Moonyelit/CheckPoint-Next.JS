import React from "react";
import Image from "next/image";
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
    <div 
      role="progressbar" 
      aria-valuenow={Math.round(progress)} 
      aria-valuemin={0} 
      aria-valuemax={100}
      aria-label={`Note du jeu : ${Math.round(progress)}%`}
      tabIndex={0}
    >
      <svg
        width={finalSize}
        height={finalSize}
        className="donut-progress"
        style={{ display: "block", margin: "auto", transform: "rotate(-135deg)" }}
        aria-hidden="true"
        focusable="false"
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
    </div>
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

  // Générer une description accessible pour l'image
  const getImageDescription = () => {
    const parts = [title];
    if (year) parts.push(`sorti en ${year}`);
    if (studio || developer) parts.push(`développé par ${studio || developer}`);
    return `Jaquette du jeu ${parts.join(', ')}`;
  };
  
  return (
    <header 
      className="game-fiche-header"
      role="banner"
      aria-labelledby="game-title"
    >
      <div 
        className="game-fiche-header__cover-container"
        role="img"
        aria-label={getImageDescription()}
      >
        {cleanCoverUrl ? (
          <Image 
            className="game-fiche-header__cover" 
            src={cleanCoverUrl} 
            alt={getImageDescription()}
            width={300}
            height={400}
            priority
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder-cover.jpg";
            }}
          />
        ) : (
          <Image 
            className="game-fiche-header__cover" 
            src="/images/placeholder-cover.jpg" 
            alt={getImageDescription()}
            width={300}
            height={400}
            priority
          />
        )}
      </div>
      <div className="game-fiche-header__content">
        <h1 
          id="game-title"
          className="game-fiche-header__title"
        >
          {title} {year && <span aria-label={`sorti en ${year}`}>({year})</span>}
        </h1>
        {(studio || developer) && (
          <div 
            className="game-fiche-header__subtitle"
            aria-label={`Développé par ${studio || developer}`}
          >
            {studio || developer}
          </div>
        )}
      </div>
      {totalRating && totalRating > 0 && (
        <div 
          className="game-fiche-header__rating"
          aria-label={`Note globale du jeu : ${Math.round(totalRating)}%`}
        >
          <DonutProgress value={totalRating} size={100} strokeWidth={15} responsive={isResponsive} />
        </div>
      )}
    </header>
  );
} 