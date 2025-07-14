import React, { useState } from "react";
import { Game } from "@/types/game";
import MediaOverlay from "./MediaOverlay";
import "./MediaSection3.scss";

interface MediaSection3Props {
  game: Game;
}

export default function MediaSection3({ game }: MediaSection3Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!game.artworks || game.artworks.length === 0) {
    return null;
  }

  return (
    <div className="media-section3">
      <div className="media-content__item">
        <h4 className="media-content__item-title">ARTWORKS ({game.artworks.length})</h4>
        <div className="media-content__artworks">
          {game.artworks.map((artwork, index) => (
            <img 
              key={artwork.id || index}
              src={artwork.url} 
              alt={artwork.title || `Artwork ${index + 1}`}
              className="media-content__item-image"
              onClick={() => setOpenIndex(index)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        {openIndex !== null && (
          <MediaOverlay
            open={true}
            onClose={() => setOpenIndex(null)}
            type="image"
            src={game.artworks[openIndex].url}
            alt={game.artworks[openIndex].title || `Artwork ${openIndex + 1}`}
          />
        )}
      </div>
    </div>
  );
} 