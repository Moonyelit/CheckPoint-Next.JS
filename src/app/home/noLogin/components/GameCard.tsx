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
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  // Transforme l'URL de l'image si nécessaire
  const processedImageUrl = getImageUrl(imageUrl);

  // Log pour déboguer les URLs d'images
  React.useEffect(() => {
    console.log(`🎮 GameCard: ${title}`, { 
      originalUrl: imageUrl, 
      processedUrl: processedImageUrl,
      imageError, 
      imageLoaded, 
      slug, 
      isActive 
    });
  }, [title, imageUrl, processedImageUrl, imageError, imageLoaded, slug, isActive]);

  const handleImageError = () => {
    console.error(`❌ Erreur de chargement d'image pour: ${title}`, {
      originalUrl: imageUrl,
      processedUrl: processedImageUrl
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Image chargée avec succès pour: ${title}`, { 
      originalUrl: imageUrl,
      processedUrl: processedImageUrl 
    });
    setImageLoaded(true);
    setImageError(false);
  };

  const handleCardClick = () => {
    if (isActive && slug) {
      // Si c'est la carte active, naviguer vers la page du jeu
      console.log(`🎯 Navigation vers le jeu: ${title} (slug: ${slug})`);
      router.push(`/games/${slug}`);
    } else if (onCardClick && !isActive) {
      // Si ce n'est pas la carte active, la déplacer au centre
      console.log(`🔄 Déplacement de la carte au centre: ${title} (index: ${index})`);
      onCardClick(index);
    } else if (!isActive) {
      console.log(`⚠️ Pas de callback disponible pour déplacer la carte: ${title}`);
    } else if (!slug) {
      console.warn(`⚠️ Pas de slug disponible pour le jeu: ${title}`);
    }
  };

  return (
    <div 
      className={`game-card ${isActive ? 'game-card--active' : ''}`}
      onClick={handleCardClick}
      style={{ 
        cursor: isActive && slug ? 'pointer' : 'pointer',
        opacity: isActive ? 1 : 0.7
      }}
    >
      <div className="game-card-image">
        {!imageError && processedImageUrl ? (
          <LazyImage
            src={processedImageUrl}
            alt={alt}
            width={300}
            height={600}
            className="game-card__image"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div
            style={{
              width: 300,
              height: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              textAlign: 'center',
              padding: '20px'
            }}
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
