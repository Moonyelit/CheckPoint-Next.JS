// src/app/home/noLogin/GameCard.tsx
"use client";
import React, { useState } from "react";
import "./GameCard.scss";
import Image from 'next/image';

export interface GameCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
}

export default function GameCard({ title, subtitle, imageUrl, alt }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Log pour déboguer les URLs d'images
  React.useEffect(() => {
    console.log(`🎮 GameCard: ${title}`, { imageUrl, imageError, imageLoaded });
  }, [title, imageUrl, imageError, imageLoaded]);

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

  return (
    <div className="game-card">
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
