// src/app/home/noLogin/GameCard.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./GameCard.scss";
import Image from 'next/image';

export interface GameCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
  slug?: string; // Ajout du slug pour la navigation
}

export default function GameCard({ title, subtitle, imageUrl, alt, slug }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  // Log pour déboguer les URLs d'images
  React.useEffect(() => {
    console.log(`🎮 GameCard: ${title}`, { imageUrl, imageError, imageLoaded, slug });
  }, [title, imageUrl, imageError, imageLoaded, slug]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`❌ Erreur de chargement d'image pour: ${title}`, {
      imageUrl,
      error: e
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Image chargée avec succès pour: ${title}`, { imageUrl });
    setImageLoaded(true);
    setImageError(false);
  };

  const handleCardClick = () => {
    if (slug) {
      console.log(`🎯 Navigation vers le jeu: ${title} (slug: ${slug})`);
      router.push(`/games/${slug}`);
    } else {
      console.warn(`⚠️ Pas de slug disponible pour le jeu: ${title}`);
    }
  };

  return (
    <div 
      className="game-card" 
      onClick={handleCardClick}
      style={{ cursor: slug ? 'pointer' : 'default' }}
    >
      <div className="game-card-image">
        {!imageError && imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            width={300}
            height={600}
            style={{ objectFit: 'cover' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={true} // Charge en priorité pour les images du carousel
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
                  URL: {imageUrl}
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
