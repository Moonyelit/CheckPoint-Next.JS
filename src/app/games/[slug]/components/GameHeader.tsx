"use client";

import Image from "next/image";
import { useState } from "react";
import "./styles/GameHeader.scss";

interface GameHeaderProps {
    name: string;
    year: number;
    studio: string;
    coverUrl: string;
    backgroundUrl?: string;
    totalRating?: number;
    userRating?: number;
    firstScreenshotUrl?: string;
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
    const [backgroundImageError, setBackgroundImageError] = useState(false);
    const [coverImageError, setCoverImageError] = useState(false);

    // Fonction pour obtenir l'URL de l'image de fond avec fallback
    const getBackgroundImageUrl = () => {
        if (backgroundImageError) return "/placeholder-background.jpg";
        if (firstScreenshotUrl) return firstScreenshotUrl;
        if (backgroundUrl) return backgroundUrl;
        if (coverUrl) return coverUrl;
        return "/placeholder-background.jpg";
    };

    // Fonction pour obtenir l'URL de la couverture avec fallback
    const getCoverImageUrl = () => {
        if (coverImageError) return "/images/Game/Default game.jpg";
        if (coverUrl) return coverUrl;
        return "/images/Game/Default game.jpg";
    };

    // Fonction pour améliorer la qualité des images IGDB
    const improveImageQuality = (url: string, size: string = 't_cover_big') => {
        if (!url || !url.includes('images.igdb.com')) {
            return url;
        }

        // Patterns des tailles de basse qualité à remplacer
        const lowQualityPatterns = [
            /t_thumb/g,
            /t_micro/g,
            /t_cover_small/g,
            /t_screenshot_med/g,
            /t_cover_small_2x/g
        ];

        // Vérifie si l'image est déjà en haute qualité
        const highQualityPatterns = ['t_cover_big', 't_1080p', 't_720p', 't_original'];
        const hasHighQuality = highQualityPatterns.some(pattern => url.includes(pattern));
        
        if (hasHighQuality) {
            return url; // Déjà en haute qualité
        }

        // Remplace les patterns de basse qualité
        let improvedUrl = url;
        lowQualityPatterns.forEach(pattern => {
            improvedUrl = improvedUrl.replace(pattern, size);
        });

        // Si aucun pattern trouvé, ajoute la taille à la fin
        if (improvedUrl === url && url.includes('.jpg')) {
            improvedUrl = url.replace('.jpg', `_${size}.jpg`);
        }

        return improvedUrl;
    };

    const backgroundImageUrl = improveImageQuality(getBackgroundImageUrl(), 't_1080p');
    const coverImageUrl = getCoverImageUrl();

    return (
        <header className="game-header">
            <div className="game-header__background">
                <Image
                    src={backgroundImageUrl}
                    alt={`Image de fond pour ${name}`}
                    layout="fill"
                    objectFit="cover"
                    quality={85}
                    priority
                    className="game-header__background-image"
                    onError={() => setBackgroundImageError(true)}
                />
                <div className="game-header__overlay"></div>
            </div>
            
            <div className="game-header__content main-container">
                <div className="game-header__cover">
                    <Image
                        src={coverImageUrl}
                        alt={`Jaquette de ${name}`}
                        width={260}
                        height={345}
                        quality={90}
                        priority
                        className="game-header__cover-image"
                        onError={() => setCoverImageError(true)}
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