"use client";

import { useEffect, useState } from "react";
import LazyImage from "@/components/common/LazyImage";
import { getImageUrl } from "@/lib/imageUtils";
import DebugPanel from "@/components/common/DebugPanel";
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
    const [isClient, setIsClient] = useState(false);

    // Éviter l'erreur d'hydratation en rendant le debug seulement côté client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Simplification de la logique de fallback pour le debug
    const backgroundImageUrl = firstScreenshotUrl || backgroundUrl || coverUrl || "/images/Game/Default game.jpg";
    const coverImageUrl = coverUrl || "/images/Game/Default game.jpg";

    // Traiter les URLs avec imageUtils seulement si ce ne sont pas des images locales
    const processedBackgroundUrl = backgroundImageUrl.startsWith('/') ? backgroundImageUrl : getImageUrl(backgroundImageUrl);
    const processedCoverUrl = coverImageUrl.startsWith('/') ? coverImageUrl : getImageUrl(coverImageUrl);

    // Debug: afficher les URLs pour diagnostiquer
    console.log('🔍 Debug GameHeader:', {
        name,
        firstScreenshotUrl,
        backgroundUrl,
        coverUrl,
        backgroundImageUrl,
        coverImageUrl,
        processedBackgroundUrl,
        processedCoverUrl
    });

    const debugData = {
        name,
        firstScreenshotUrl,
        backgroundUrl,
        coverUrl,
        backgroundImageUrl,
        coverImageUrl,
        processedBackgroundUrl,
        processedCoverUrl
    };

    return (
        <header className="game-header">
            {/* Debug panel seulement côté client */}
            {isClient && <DebugPanel title="GameHeader" data={debugData} />}

            <div className="game-header__background">
                <div className="game-header__overlay"></div>
                <LazyImage
                    src={processedBackgroundUrl}
                    alt={`Image de fond pour ${name}`}
                    className="game-header__background-image"
                    onLoad={() => {
                        console.log('✅ Image de fond chargée avec succès:', processedBackgroundUrl);
                    }}
                    onError={() => {
                        console.log('❌ Erreur lors du chargement de l\'image de fond:', processedBackgroundUrl);
                    }}
                />
                <div className="game-header__overlay"></div>
            </div>
            
            <div className="game-header__content main-container">
                <div className="game-header__cover">
                    <LazyImage
                        src={processedCoverUrl}
                        alt={`Jaquette de ${name}`}
                        width={260}
                        height={345}
                        className="game-header__cover-image"
                        onLoad={() => {
                            console.log('✅ Couverture chargée avec succès:', processedCoverUrl);
                        }}
                        onError={() => {
                            console.log('❌ Erreur lors du chargement de la couverture:', processedCoverUrl);
                        }}
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