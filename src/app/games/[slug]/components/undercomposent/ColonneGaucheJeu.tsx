import React, { useState } from "react";
import "../styles/ColonneGaucheJeu.scss";
import "@/components/common/styles/Button.scss";

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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22" fill="none">
            <path d="M11.7499 18.1701C11.6828 18.1684 11.6168 18.1523 11.5565 18.123C11.4961 18.0937 11.4427 18.0518 11.3999 18.0001C11.3522 17.9552 11.3147 17.9006 11.2899 17.8401C11.2634 17.7802 11.2498 17.7155 11.2498 17.6501C11.2498 17.5847 11.2634 17.5199 11.2899 17.4601C11.3147 17.3995 11.3522 17.345 11.3999 17.3001C11.495 17.2078 11.6223 17.1562 11.7549 17.1562C11.8874 17.1562 12.0147 17.2078 12.1099 17.3001C12.2004 17.394 12.2507 17.5196 12.2499 17.6501C12.2603 17.713 12.2603 17.7772 12.2499 17.8401C12.2216 17.8987 12.1845 17.9527 12.1399 18.0001C12.0918 18.0559 12.0318 18.1002 11.9643 18.1296C11.8968 18.1591 11.8235 18.1729 11.7499 18.1701Z" fill="#F5F5F5"/>
            <path d="M11.7501 14.9202C11.6845 14.921 11.6195 14.908 11.5592 14.8822C11.4989 14.8564 11.4447 14.8182 11.4001 14.7702C11.3522 14.7253 11.3141 14.671 11.288 14.6108C11.262 14.5507 11.2485 14.4858 11.2485 14.4202C11.2485 14.3546 11.262 14.2897 11.288 14.2295C11.3141 14.1693 11.3522 14.115 11.4001 14.0702C11.4423 14.0195 11.4977 13.9815 11.5601 13.9602C11.6524 13.9227 11.7538 13.9132 11.8515 13.9328C11.9493 13.9523 12.0392 14.0001 12.1101 14.0702C12.1965 14.1667 12.2461 14.2906 12.2501 14.4202C12.2508 14.5506 12.2006 14.6762 12.1101 14.7702C12.0635 14.8185 12.0075 14.8567 11.9456 14.8825C11.8837 14.9083 11.8171 14.9211 11.7501 14.9202Z" fill="#F5F5F5"/>
            <path d="M11.3599 21.5H0.939941C0.807333 21.5 0.680156 21.4473 0.586388 21.3536C0.49262 21.2598 0.439941 21.1326 0.439941 21V1C0.439941 0.867392 0.49262 0.740215 0.586388 0.646447C0.680156 0.552678 0.807333 0.5 0.939941 0.5H15.0599C15.1925 0.5 15.3197 0.552678 15.4135 0.646447C15.5073 0.740215 15.5599 0.867392 15.5599 1V17.29C15.5599 18.4048 15.1178 19.4741 14.3304 20.2634C13.543 21.0526 12.4748 21.4974 11.3599 21.5ZM1.43994 20.5H11.3599C12.2096 20.4974 13.0235 20.158 13.6233 19.5563C14.2231 18.9546 14.5599 18.1396 14.5599 17.29V1.5H1.43994V20.5Z" fill="#F5F5F5"/>
            <path d="M5.86987 18.1699C5.73807 18.1674 5.61237 18.1139 5.51915 18.0206C5.42593 17.9274 5.37243 17.8017 5.36987 17.6699V14.4199C5.36987 14.2873 5.42255 14.1601 5.51632 14.0664C5.61009 13.9726 5.73726 13.9199 5.86987 13.9199C6.00248 13.9199 6.12966 13.9726 6.22343 14.0664C6.31719 14.1601 6.36987 14.2873 6.36987 14.4199V17.6699C6.36987 17.8025 6.31719 17.9297 6.22343 18.0235C6.12966 18.1172 6.00248 18.1699 5.86987 18.1699Z" fill="#F5F5F5"/>
            <path d="M7.5 16.54H4.25C4.11739 16.54 3.99021 16.4874 3.89645 16.3936C3.80268 16.2998 3.75 16.1726 3.75 16.04C3.75 15.9074 3.80268 15.7803 3.89645 15.6865C3.99021 15.5927 4.11739 15.54 4.25 15.54H7.5C7.63261 15.54 7.75979 15.5927 7.85355 15.6865C7.94732 15.7803 8 15.9074 8 16.04C8 16.1726 7.94732 16.2998 7.85355 16.3936C7.75979 16.4874 7.63261 16.54 7.5 16.54Z" fill="#F5F5F5"/>
            <path d="M12.24 11.5402H3.78003C3.64742 11.5402 3.52024 11.4875 3.42648 11.3937C3.33271 11.3 3.28003 11.1728 3.28003 11.0402V3.68018C3.28003 3.54757 3.33271 3.42039 3.42648 3.32662C3.52024 3.23285 3.64742 3.18018 3.78003 3.18018H12.24C12.3726 3.18018 12.4998 3.23285 12.5936 3.32662C12.6874 3.42039 12.74 3.54757 12.74 3.68018V11.0002C12.7456 11.0691 12.7367 11.1385 12.7141 11.2038C12.6915 11.2692 12.6555 11.3291 12.6085 11.3799C12.5615 11.4306 12.5045 11.4711 12.4411 11.4987C12.3777 11.5263 12.3092 11.5404 12.24 11.5402ZM4.24003 10.5402H11.7V4.18018H4.28003L4.24003 10.5402Z" fill="#F5F5F5"/>
          </svg>
        </span>
        <span>
          <p>J&apos;y joue</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
            <path d="M15.827 14.75L11.7833 13.375V7.62551M22.5665 12C22.5665 5.92487 17.7387 1 11.7833 1C5.82783 1 1 5.92487 1 12C1 18.0751 5.82783 23 11.7833 23C15.7746 23 19.2594 20.7879 21.1239 17.5M19.6084 10.7929L22.3042 13.5429L25 10.7929" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span>
          <p>Je veux</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path d="M2 10V14C2 17.2998 2 18.9497 3.02513 19.9749C4.05025 21 5.70017 21 9 21H11C14.2998 21 15.9497 21 16.9749 19.9749C18 18.9497 18 17.2998 18 14V10" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 8C1 7.25231 1 6.87846 1.20096 6.6C1.33261 6.41758 1.52197 6.26609 1.75 6.16077C2.09808 6 2.56538 6 3.5 6H16.5C17.4346 6 17.9019 6 18.25 6.16077C18.478 6.26609 18.6674 6.41758 18.799 6.6C19 6.87846 19 7.25231 19 8C19 8.74769 19 9.12154 18.799 9.4C18.6674 9.58242 18.478 9.73391 18.25 9.83923C17.9019 10 17.4346 10 16.5 10H3.5C2.56538 10 2.09808 10 1.75 9.83923C1.52197 9.73391 1.33261 9.58242 1.20096 9.4C1 9.12154 1 8.74769 1 8Z" stroke="#F5F5F5" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M4 2.78571C4 1.79949 4.79949 1 5.78571 1H6.14286C8.2731 1 10 2.7269 10 4.85714V6H7.21429C5.43908 6 4 4.56091 4 2.78571Z" stroke="#F5F5F5" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16 2.78571C16 1.79949 15.2005 1 14.2143 1H13.8571C11.7269 1 10 2.7269 10 4.85714V6H12.7857C14.5609 6 16 4.56091 16 2.78571Z" stroke="#F5F5F5" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 10L10 21" stroke="#F5F5F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </aside>
  );
} 