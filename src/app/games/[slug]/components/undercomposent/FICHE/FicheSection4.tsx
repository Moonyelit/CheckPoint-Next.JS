import React, { useRef, useEffect, useState } from "react";
import { Game } from "@/types/game";
import "./FicheSection4.scss";

interface FicheSection4Props {
  game: Game;
}

const pegiLogos: Record<string, string> = {
  "PEGI_3": "/images/Pegi/PEGI_3.png",
  "PEGI_7": "/images/Pegi/PEGI_7.png",
  "PEGI_12": "/images/Pegi/PEGI_12.png",
  "PEGI_16": "/images/Pegi/PEGI_16.png",
  "PEGI_18": "/images/Pegi/PEGI_18.png",
};

const esrbLogos: Record<string, string> = {
  "ESRB_EVERYONE": "/esrb-everyone.png",
  "ESRB_TEEN": "/esrb-teen.png",
  "ESRB_MATURE": "/esrb-mature.png",
};

// Fonction utilitaire pour normaliser les valeurs PEGI non standard
function normalizeAgeRating(rating: string): string | null {
  if (!rating) return null;
  // PEGI X ou PEGI_X
  const pegiMatch = rating.match(/PEGI[ _-]?(\d+)/i);
  if (pegiMatch) {
    const num = parseInt(pegiMatch[1], 10);
    if (num <= 3 || num === 4 || num === 1) return "PEGI_3";
    if (num <= 7) return "PEGI_7";
    if (num <= 12) return "PEGI_12";
    if (num <= 16) return "PEGI_16";
    if (num >= 18) return "PEGI_18";
  }
  // ESRB direct
  if (esrbLogos[rating]) return rating;
  // PEGI standard
  if (pegiLogos[rating]) return rating;
  return null;
}

const FicheSection4: React.FC<FicheSection4Props> = ({ game }) => {
  const [logoHeight, setLogoHeight] = useState(120); // Hauteur par défaut
  const datesBlocRef = useRef<HTMLDivElement>(null);

  // Fonction pour formater les noms des plateformes
  const formatPlatformName = (platform: string): string => {
    const platformMap: { [key: string]: string } = {
      "Xbox Series X|S": "SERIES X|S",
      "Xbox Series X S": "SERIES X|S",
      "PlayStation 5": "PS5",
      "PlayStation 4": "PS4",
      "PlayStation 3": "PS3",
      "PlayStation 2": "PS2",
      "PlayStation": "PS",
      "Nintendo Switch": "Switch",
      "Nintendo Switch 2": "Switch 2",
      "Nintendo 3DS": "3DS",
      "Nintendo DS": "DS",
      "PC (Microsoft Windows)": "PC",
      "PC": "PC",
      "macOS": "Mac",
      "Linux": "Linux",
      "Android": "Android",
      "iOS": "iOS"
    };

    // Chercher une correspondance exacte d'abord
    if (platformMap[platform]) {
      return platformMap[platform];
    }

    // Chercher une correspondance partielle
    for (const [key, value] of Object.entries(platformMap)) {
      if (platform.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Si aucune correspondance, retourner le nom original
    return platform;
  };

  // Fonction pour formater les dates de manière sécurisée
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("fr-FR");
    } catch {
      return "-";
    }
  };

  // Créer les plateformes avec les vraies données du jeu
  const platforms = React.useMemo(() => {
    if (game.platforms && game.platforms.length > 0) {
      return game.platforms.map(platform => ({
        name: formatPlatformName(platform),
        date: game.releaseDatesByPlatform?.[platform] || game.releaseDate
      }));
    }
    
    // Fallback si pas de plateformes
    return [
      { name: "PC", date: game.releaseDate },
      { name: "PS5", date: game.releaseDate },
      { name: "SERIES S|X", date: game.releaseDate },
    ];
  }, [game.platforms, game.releaseDatesByPlatform, game.releaseDate]);

  // Calculer la hauteur du logo en fonction du nombre de plateformes
  useEffect(() => {
    const updateLogoHeight = () => {
      if (datesBlocRef.current) {
        const blocHeight = datesBlocRef.current.offsetHeight;
        const headerHeight = 60; // Hauteur approximative du header
        const padding = 48; // Padding top + bottom (1.2rem + 1.5rem)
        
        const contentHeight = blocHeight - headerHeight - padding;
        const calculatedHeight = Math.max(80, Math.min(200, contentHeight)); // Min 80px, Max 200px
        
        setLogoHeight(calculatedHeight);
      }
    };

    // Mise à jour initiale
    updateLogoHeight();

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(updateLogoHeight);
    if (datesBlocRef.current) {
      resizeObserver.observe(datesBlocRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [platforms.length]);

  // Gestion des ratings (supporte plusieurs séparés par virgule)
  const rawRatings = (game.ageRating || "").split(",").map(r => r.trim()).filter(Boolean);
  const ratings = rawRatings.map(normalizeAgeRating).filter(Boolean) as string[];

  return (
    <section className="fiche-section4 fiche-section4--flex">
      {/* Bloc Dates de sorties */}
      <div className="fiche-section4__bloc" ref={datesBlocRef}>
        <div className="fiche-section4__header">DATES DE SORTIES</div>
        <div className="fiche-section4__list">
          {platforms.length > 0 ? (
            platforms.map((platform, index) => (
              <div className="fiche-section4__row" key={`${platform.name}-${index}`}>
                <span className="fiche-section4__platform">{platform.name}</span>
                <span className="fiche-section4__date">
                  {formatDate(platform.date)}
                </span>
              </div>
            ))
          ) : (
            <div className="fiche-section4__row">
              <span className="fiche-section4__platform">Aucune plateforme</span>
              <span className="fiche-section4__date">-</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Bloc Classification par âge */}
      <div className="fiche-section4__bloc">
        <div className="fiche-section4__header">CLASSIFICATION PAR ÂGE</div>
        <div className="fiche-section4__logos">
          {ratings.length > 0 ? (
            ratings.map((rating) => {
              if (pegiLogos[rating]) {
                return (
                  <img 
                    key={rating} 
                    src={pegiLogos[rating]} 
                    alt={rating} 
                    className="fiche-section4__logo" 
                    style={{ height: `${logoHeight}px` }}
                  />
                );
              }
              if (esrbLogos[rating]) {
                return (
                  <img 
                    key={rating} 
                    src={esrbLogos[rating]} 
                    alt={rating} 
                    className="fiche-section4__logo" 
                    style={{ height: `${logoHeight}px` }}
                  />
                );
              }
              return null;
            })
          ) : (
            <span className="fiche-section4__no-rating">Non classé</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default FicheSection4; 