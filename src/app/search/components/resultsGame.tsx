import React, { useEffect, useState } from "react";
import LazyImage from "@/components/common/LazyImage";
import "../styles/resultsGame.scss";

interface ResultsGameProps {
  title: string;
  coverUrl?: string;
  platforms?: string[];
  score?: number;
  style?: React.CSSProperties;
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
  title,
  coverUrl,
  platforms,
  score,
  style
}) => {
  const { donut, stroke } = useDonutSize();
  const defaultCover = "/images/Game/Default game.jpg";
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  return (
    <article className="results-game" style={style}>
      <div className="results-game__cover">
        <LazyImage
          src={coverUrl || defaultCover}
          alt={title}
          width={120}
          height={160}
          className="results-game__image"
        />
      </div>
      
      <div className="results-game__info">
        <div className="results-game__title">{title}</div>
        {platforms && platforms.length > 0 && (
          <div className="results-game__platforms">
            {(showAllPlatforms ? platforms : platforms.slice(0, 3)).map((platform, index) => (
              <span key={index} className="results-game__platform">
                {formatPlatform(platform)}
              </span>
            ))}
            {platforms.length > 3 && !showAllPlatforms && (
              <span
                className="results-game__platform-more"
                onClick={() => setShowAllPlatforms(true)}
              >
                +{platforms.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      {typeof score === 'number' && (
        <div className="results-game__score">
          <DonutProgress value={score} size={donut} strokeWidth={stroke} />
        </div>
      )}
    </article>
  );
};

export default ResultsGame;
