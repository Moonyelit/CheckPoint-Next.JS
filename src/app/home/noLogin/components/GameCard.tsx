// src/app/home/noLogin/GameCard.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./GameCard.scss";
import LazyImage from "@/components/common/LazyImage";
import { getImageUrl } from "@/lib/imageUtils";

export interface GameCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
  slug?: string; // Ajout du slug pour la navigation
  isActive?: boolean; // Indique si c'est la carte active (centrale)
  onCardClick?: (index: number) => void; // Callback pour déplacer la carte au centre
  index?: number; // Index de la carte pour le callback
}

export default function GameCard({ 
  title, 
  subtitle, 
  imageUrl, 
  alt, 
  slug, 
  isActive = false,
  onCardClick,
  index = 0
}: GameCardProps) {
  const [imageError, setImageError] = useState(false);

  const router = useRouter();

  // Transforme l'URL de l'image si nécessaire
  const processedImageUrl = getImageUrl(imageUrl);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    if (isActive && slug) {
      // Si c'est la carte active, naviguer vers la page du jeu
      router.push(`/games/${slug}`);
    } else if (onCardClick && !isActive) {
      // Si ce n'est pas la carte active, la déplacer au centre
      onCardClick(index);
    } else if (!isActive) {
      console.warn(`⚠️ Pas de callback disponible pour déplacer la carte: ${title}`);
    } else if (!slug) {
      console.warn(`⚠️ Pas de slug disponible pour le jeu: ${title}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div 
      className={`game-card ${isActive ? 'game-card--active' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={isActive ? `Voir les détails de ${title}` : `Sélectionner ${title} pour le centrer`}
      aria-pressed={isActive}
      style={{ 
        cursor: isActive && slug ? 'pointer' : 'pointer',
        opacity: isActive ? 1 : 0.7
      }}
    >
      <div className="game-card-image" role="img" aria-label={alt}>
        {!imageError && processedImageUrl ? (
          <LazyImage
            src={processedImageUrl}
            alt={alt}
            className="game-card__image"
            onError={handleImageError}
          />
        ) : (
          <div
            style={{
              background: 'linear-gradient(135deg, #748599 0%, #a8bbc5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              textAlign: 'center',
              padding: '20px'
            }}
            role="img"
            aria-label={imageError ? "Image non disponible" : `Image de ${title}`}
          >
            {imageError ? (
              <>
                <div>❌ Image non disponible</div>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                  URL: {processedImageUrl}
                </div>
              </>
            ) : (
              <div>🎮 {title}</div>
            )}
          </div>
        )}
      </div>
      <div className="game-card-info">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
