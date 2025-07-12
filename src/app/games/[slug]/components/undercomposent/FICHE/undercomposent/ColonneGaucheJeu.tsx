import React, { useState } from "react";
import "./styles/ColonneGaucheJeu.scss";
import "@/components/common/styles/Button.scss";
import Image from "next/image";

// Types pour les étoiles
type StarState = "empty" | "half" | "full";

// Composant étoile SVG
const Star = ({ 
  state, 
  onMouseEnter, 
  onMouseLeave,
  index 
}: { 
  state: StarState; 
  onMouseEnter: (index: number, isHalf: boolean) => void;
  onMouseLeave: () => void;
  index: number;
}) => {
  const handleMouseEnter = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const isHalf = mouseX < rect.width / 2; // Moitié gauche = demi-étoile, moitié droite = étoile pleine
    onMouseEnter(index, isHalf);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
  };

  if (state === "half") {
    return (
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: "pointer" }}
      >
        <defs>
          <linearGradient id={`halfStar${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" style={{ stopColor: "#F5F5F5", stopOpacity: 0.65 }} />
            <stop offset="50%" style={{ stopColor: "transparent" }} />
          </linearGradient>
        </defs>
        <path 
          d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" 
          fill={`url(#halfStar${index})`}
          stroke="#F5F5F5" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (state === "full") {
    return (
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: "pointer" }}
      >
        <path 
          d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" 
          fill="#F5F5F5" 
          fillOpacity="0.65" 
          stroke="#F5F5F5" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "pointer" }}
    >
      <path 
        d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" 
        stroke="#F5F5F5" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function ColonneGaucheJeu() {
  const [stars, setStars] = useState<StarState[]>(["empty", "empty", "empty", "empty", "empty"]);

  const handleStarHover = (index: number, isHalf: boolean) => {
    const newStars: StarState[] = ["empty", "empty", "empty", "empty", "empty"];
    
    // Remplir toutes les étoiles jusqu'à l'index survolé
    for (let i = 0; i < index; i++) {
      newStars[i] = "full";
    }
    
    // Définir l'état de l'étoile survolée selon la zone
    if (isHalf) {
      // Survol sur la moitié gauche → demi-étoile
      newStars[index] = "half";
    } else {
      // Survol sur la moitié droite → étoile pleine
      newStars[index] = "full";
    }
    
    setStars(newStars);
  };

  const handleStarLeave = () => {
    // Remettre toutes les étoiles vides quand on quitte la zone
    setStars(["empty", "empty", "empty", "empty", "empty"]);
  };

  return (
    <aside className="colonne-gauche-jeu">
      <button className="button button--inverse">Ajouter à ma collection</button>
      <div className="stars">
        {stars.map((state, index) => (
          <Star 
            key={index}
            state={state}
            onMouseEnter={handleStarHover}
            onMouseLeave={handleStarLeave}
            index={index}
          />
        ))}
      </div>
      <button className="button button--inverse">Ajouter à une liste</button>
      <div className="quick-actions">
        <span>
          <p>J&apos;ai</p>
          <Image src="/images/Icons/svg/book-icon.svg" alt="J'ai" width={16} height={22} />
        </span>
        <span>
          <p>J&apos;y joue</p>
          <Image src="/images/Icons/svg/gamepad-icon.svg" alt="J'y joue" width={26} height={24} />
        </span>
        <span>
          <p>Je veux</p>
          <Image src="/images/Icons/svg/bag-icon.svg" alt="Je veux" width={20} height={22} />
        </span>
      </div>
    </aside>
  );
} 