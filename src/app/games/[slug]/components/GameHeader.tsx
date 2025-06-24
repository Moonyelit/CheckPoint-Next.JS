import Image from "next/image";
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
    return (
        <header className="game-header">
            <div className="game-header__background">
                <Image
                    src={firstScreenshotUrl || backgroundUrl || coverUrl}
                    alt={`Image de fond pour ${name}`}
                    layout="fill"
                    objectFit="cover"
                    quality={85}
                    priority
                    className="game-header__background-image"
                />
                <div className="game-header__overlay"></div>
            </div>
            
            <div className="game-header__content main-container">
                <div className="game-header__cover">
                    <Image
                        src={coverUrl}
                        alt={`Jaquette de ${name}`}
                        width={260}
                        height={345}
                        quality={90}
                        priority
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
                
                <div className="game-header__actions">
                    <button className="game-header__action-btn game-header__action-btn--share" aria-label="Partager">
                        📤
                    </button>
                    <button className="game-header__action-btn game-header__action-btn--favorite" aria-label="Ajouter aux favoris">
                        ❤️
                    </button>
                    <button className="game-header__action-btn game-header__action-btn--compare" aria-label="Comparer">
                        ⚖️
                    </button>
                </div>
            </div>
        </header>
    );
} 