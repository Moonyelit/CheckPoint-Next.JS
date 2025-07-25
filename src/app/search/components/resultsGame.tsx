import React, { useEffect, useState, useMemo, useCallback } from "react";
import LazyImage from "@/components/common/LazyImage";
import "../styles/resultsGame.scss";
import Link from "next/link";
import { getImageUrl } from "@/lib/imageUtils";

interface ResultsGameProps {
  slug: string;
  title: string;
  coverUrl?: string;
  platforms?: string[];
  score?: number;
  totalRatingCount?: number; // Nombre de votes
  style?: React.CSSProperties;
  // Critères appliqués
  criteria?: {
    minVotes: number;
    minRating: number;
    limit: number;
  };
  totalCount?: number; // Nombre total de jeux correspondant aux critères
}

// Hook pour la taille responsive
function useDonutSize() {
  const [size, setSize] = useState({ donut: 100, stroke: 18 });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width <= 375) {
        setSize({ donut: 40, stroke: 8 });
      } else if (width <= 576) {
        setSize({ donut: 60, stroke: 10 });
      } else if (width <= 768) {
        setSize({ donut: 80, stroke: 14 });
      } else {
        setSize({ donut: 100, stroke: 18 });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

// Composant Donut SVG amélioré
const DonutProgress: React.FC<{ value: number; size?: number; strokeWidth?: number }> = ({ value, size = 100, strokeWidth = 18 }) => {
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
        stroke="url(#donut-gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="butt"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
      <defs>
        <linearGradient id="donut-gradient" x1="0" y1="0" x2="1" y2="1">
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

// Composant pour afficher les critères appliqués
const CriteriaInfo: React.FC<{ criteria?: { minVotes: number; minRating: number; limit: number }; totalCount?: number }> = ({ criteria, totalCount }) => {
  if (!criteria) return null;

  return (
    <div className="criteria-info" style={{
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      border: '1px solid #ddd'
    }}>
      <div><strong>Critères appliqués :</strong></div>
      <div>• Note minimum : {criteria.minRating}/100</div>
      <div>• Votes minimum : {criteria.minVotes}</div>
      <div>• Limite : {criteria.limit} jeux</div>
      {totalCount && (
        <div style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>
          {totalCount} jeux correspondent à ces critères
        </div>
      )}
    </div>
  );
};

// Composant pour afficher les informations de votes
const VotesInfo: React.FC<{ totalRatingCount?: number; score?: number; criteria?: { minVotes: number; minRating: number } }> = ({ totalRatingCount, score, criteria }) => {
  if (!totalRatingCount || !criteria) return null;

  const hasEnoughVotes = totalRatingCount >= criteria.minVotes;
  const hasEnoughRating = score && score >= criteria.minRating;

  return (
    <div className="votes-info" style={{
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      padding: '0.25rem',
      borderRadius: '3px',
      backgroundColor: hasEnoughVotes ? '#e8f5e8' : '#fff3cd',
      border: `1px solid ${hasEnoughVotes ? '#4caf50' : '#ffc107'}`,
      color: hasEnoughVotes ? '#2e7d32' : '#856404'
    }}>
      <div>
        <strong>Votes :</strong> {totalRatingCount.toLocaleString()}
        {!hasEnoughVotes && (
          <span style={{ color: '#d32f2f', marginLeft: '0.5rem' }}>
            ⚠️ Minimum requis : {criteria.minVotes}
          </span>
        )}
      </div>
      {score && (
        <div>
          <strong>Note :</strong> {score}/100
          {!hasEnoughRating && (
            <span style={{ color: '#d32f2f', marginLeft: '0.5rem' }}>
              ⚠️ Minimum requis : {criteria.minRating}/100
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Fonction pour formater les noms des plateformes
const formatPlatform = (platform: string): string => {
  const platformMap: { [key: string]: string } = {
    "PC (Microsoft Windows)": "PC",
    "Nintendo Switch": "Switch",
    "PlayStation 4": "PS4",
    "PlayStation 5": "PS5",
    "Xbox One": "Xbox One",
    "Xbox Series X|S": "Xbox Series",
    "Nintendo 3DS": "3DS",
    "Nintendo DS": "DS",
    "PlayStation 3": "PS3",
    "PlayStation 2": "PS2",
    "PlayStation": "PS1",
    "Xbox 360": "Xbox 360",
    "Xbox": "Xbox",
    "Nintendo 64": "N64",
    "Game Boy Advance": "GBA",
    "Game Boy Color": "GBC",
    "Game Boy": "GB",
    "PlayStation Vita": "PS Vita",
    "PlayStation Portable": "PSP"
  };

  return platformMap[platform] || platform;
};

const ResultsGame: React.FC<ResultsGameProps> = ({
  slug,
  title,
  coverUrl,
  platforms,
  score,
  totalRatingCount,
  criteria,
  totalCount,
  style
}) => {
  const { donut, stroke } = useDonutSize();
  const defaultCover = "/images/Game/Default game.jpg";
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Transforme l'URL de l'image si nécessaire
  const imageUrl = useMemo(() => {
    if (!coverUrl) return defaultCover;
    try {
      return getImageUrl(coverUrl);
    } catch (error) {
      console.error('Erreur lors du traitement de l\'URL:', error);
      return defaultCover;
    }
  }, [coverUrl]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  return (
    <Link href={`/games/${slug}`} className="results-game-link">
      <article className="results-game" style={style}>
        <div className="results-game__cover">
          {!imageError ? (
            <LazyImage
              src={imageUrl}
              alt={title}
              width={120}
              height={160}
              className="results-game__image"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div
              className="results-game__fallback"
              style={{
                width: 120,
                height: 160,
                backgroundColor: 'var(--gris-fonce)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.7rem',
                textAlign: 'center',
                padding: '0.5rem',
                borderRadius: '8px'
              }}
            >
              {title}
            </div>
          )}
        </div>
        
        <div className="results-game__info">
          <div className="results-game__title">{title}</div>
          
          {/* Affichage des informations de votes */}
          <VotesInfo 
            totalRatingCount={totalRatingCount} 
            score={score} 
            criteria={criteria} 
          />
          
          {platforms && platforms.length > 0 && (
            <div className="results-game__platforms">
              {(showAllPlatforms ? platforms : platforms.slice(0, 3))
                .filter(platform => platform && typeof platform === 'string' && platform.trim() !== '')
                .map((platform, index) => (
                <span key={`${platform}-${index}`} className="results-game__platform">
                  {formatPlatform(platform)}
                </span>
              ))}
              {platforms.filter(p => p && typeof p === 'string' && p.trim() !== '').length > 3 && !showAllPlatforms && (
                <span
                  className="results-game__platform-more"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAllPlatforms(true);
                  }}
                >
                  +{platforms.filter(p => p && typeof p === 'string' && p.trim() !== '').length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Affichage des critères appliqués */}
          <CriteriaInfo criteria={criteria} totalCount={totalCount} />
        </div>
        
        {typeof score === 'number' && (
          <div className="results-game__score">
            <DonutProgress value={score} size={donut} strokeWidth={stroke} />
          </div>
        )}
      </article>
    </Link>
  );
};

export default ResultsGame;
