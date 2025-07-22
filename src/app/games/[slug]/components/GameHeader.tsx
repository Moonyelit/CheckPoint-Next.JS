"use client";

import LazyImage from "@/components/common/LazyImage";
import { getImageUrl } from "@/lib/imageUtils";
import "./styles/GameHeader.scss";

interface GameHeaderProps {
    name: string;
    coverUrl: string;
    backgroundUrl?: string;
    firstScreenshotUrl?: string | null;
}

export default function GameHeader({ 
    name, 
    coverUrl, 
    backgroundUrl,
    firstScreenshotUrl
}: GameHeaderProps) {

    // Amélioration de la logique de fallback avec gestion explicite des valeurs null/undefined
    const backgroundImageUrl = firstScreenshotUrl && firstScreenshotUrl !== 'null' && firstScreenshotUrl !== 'undefined' 
        ? firstScreenshotUrl 
        : (backgroundUrl && backgroundUrl !== 'null' && backgroundUrl !== 'undefined' 
            ? backgroundUrl 
            : (coverUrl && coverUrl !== 'null' && coverUrl !== 'undefined' 
                ? coverUrl 
                : "/images/Game/Default game.jpg"));
    
    // Traiter les URLs avec imageUtils seulement si ce ne sont pas des images locales
    const processedBackgroundUrl = backgroundImageUrl.startsWith('/') ? backgroundImageUrl : getImageUrl(backgroundImageUrl);

    return (
        <header className="game-header" role="banner" aria-label={`En-tête du jeu ${name}`}>
            <div className="game-header__background" role="img" aria-label={`Image de fond pour ${name}`}>
                <LazyImage
                    src={processedBackgroundUrl || "/images/Game/Default game.jpg"}
                    alt={`Image de fond pour ${name}`}
                    className="game-header__background-image"
                />
            </div>
            <div className="game-header__overlay" aria-hidden="true"></div>
        </header>
    );
} 