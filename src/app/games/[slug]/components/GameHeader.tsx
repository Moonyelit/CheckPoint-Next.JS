"use client";

import { useEffect, useState } from "react";
import LazyImage from "@/components/common/LazyImage";
import { getImageUrl } from "@/lib/imageUtils";
import "./styles/GameHeader.scss";

interface GameHeaderProps {
    name: string;
    year: number;
    studio: string;
    coverUrl: string;
    backgroundUrl?: string;
    totalRating?: number;
    userRating?: number;
    firstScreenshotUrl?: string | null;
}

export default function GameHeader({ 
    name, 
    year, 
    studio, 
    coverUrl, 
    backgroundUrl,
    totalRating,
    userRating,
    firstScreenshotUrl
}: GameHeaderProps) {
    const [isClient, setIsClient] = useState(false);

    // Éviter l'erreur d'hydratation en rendant le debug seulement côté client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Amélioration de la logique de fallback avec gestion explicite des valeurs null/undefined
    const backgroundImageUrl = firstScreenshotUrl && firstScreenshotUrl !== 'null' && firstScreenshotUrl !== 'undefined' 
        ? firstScreenshotUrl 
        : (backgroundUrl && backgroundUrl !== 'null' && backgroundUrl !== 'undefined' 
            ? backgroundUrl 
            : (coverUrl && coverUrl !== 'null' && coverUrl !== 'undefined' 
                ? coverUrl 
                : "/images/Game/Default game.jpg"));
    
    const coverImageUrl = coverUrl && coverUrl !== 'null' && coverUrl !== 'undefined' 
        ? coverUrl 
        : "/images/Game/Default game.jpg";

    // Traiter les URLs avec imageUtils seulement si ce ne sont pas des images locales
    const processedBackgroundUrl = backgroundImageUrl.startsWith('/') ? backgroundImageUrl : getImageUrl(backgroundImageUrl);
    const processedCoverUrl = coverImageUrl.startsWith('/') ? coverImageUrl : getImageUrl(coverImageUrl);

    return (
        <header className="game-header">
            <div className="game-header__background">
                <LazyImage
                    src={processedBackgroundUrl}
                    alt={`Image de fond pour ${name}`}
                    className="game-header__background-image"
                />
            </div>
            
            <div className="game-header__content main-container">
                <div className="game-header__cover">
                    <LazyImage
                        src={processedCoverUrl}
                        alt={`Jaquette de ${name}`}
                        width={260}
                        height={345}
                        className="game-header__cover-image"
                    />
                    <div className="game-header__cover-overlay">
                        <button className="game-header__play-btn" aria-label="Voir la bande-annonce">
                            ▶
                        </button>
                    </div>
                </div>
                
                <div className="game-header__info">
                    <div className="game-header__title-section">
                        <h1 className="game-header__title">{name}</h1>
                        <span className="game-header__year">({year})</span>
                    </div>
                    <p className="game-header__studio">{studio}</p>
                    
                    {(totalRating || userRating) && (
                        <div className="game-header__ratings">
                            {totalRating && (
                                <div className="game-header__rating">
                                    <span className="game-header__rating-score">{totalRating.toFixed(1)}</span>
                                    <div className="game-header__rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`game-header__star ${star <= Math.round(totalRating / 2) ? 'game-header__star--filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="game-header__rating-label">Note globale</span>
                                </div>
                            )}
                            
                            {userRating && (
                                <div className="game-header__rating game-header__rating--user">
                                    <span className="game-header__rating-score">{userRating.toFixed(1)}</span>
                                    <div className="game-header__rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`game-header__star ${star <= Math.round(userRating / 2) ? 'game-header__star--filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="game-header__rating-label">Votre note</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
            </div>
        </header>
    );
} 