import Image from "next/image";
import "./styles/GameHeader.scss";

interface GameHeaderProps {
    name: string;
    year: number;
    studio: string;
    coverUrl: string;
    backgroundUrl: string;
}

export default function GameHeader({ name, year, studio, coverUrl, backgroundUrl }: GameHeaderProps) {
    return (
        <header className="game-header">
            <div className="game-header__background">
                <Image
                    src={backgroundUrl}
                    alt={`Image de fond pour ${name}`}
                    layout="fill"
                    objectFit="cover"
                    quality={85}
                    priority
                />
            </div>
            <div className="game-header__content main-container">
                <div className="game-header__cover">
                    <Image
                        src={coverUrl}
                        alt={`Jaquette de ${name}`}
                        width={250}
                        height={330}
                        quality={90}
                        priority
                    />
                </div>
                <div className="game-header__info">
                    <h1 className="game-header__title">{name} ({year})</h1>
                    <p className="game-header__studio">{studio}</p>
                </div>
            </div>
        </header>
    )
} 