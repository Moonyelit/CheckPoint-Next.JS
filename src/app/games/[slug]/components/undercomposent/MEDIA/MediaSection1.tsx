import React, { useState } from "react";
import { Game } from "@/types/game";
import MediaOverlay from "./MediaOverlay";
import "./MediaSection1.scss";

interface MediaSection1Props {
  game: Game;
}

export default function MediaSection1({ game }: MediaSection1Props) {
  const [open, setOpen] = useState(false);
  if (!game.coverUrl) {
    return null;
  }

  return (
    <section className="media-section1" aria-label="Couverture du jeu">
      <div className="media-content__item">
        <h4 className="media-content__item-title">COUVERTURE</h4>
        <button
          className="media-content__item-image-container"
          onClick={() => setOpen(true)}
          aria-label="Voir la couverture du jeu en grand format"
          type="button"
        >
          <img 
            src={game.coverUrl} 
            alt="Couverture du jeu"
            className="media-content__item-image"
            style={{ cursor: "pointer" }}
          />
        </button>
        <MediaOverlay
          open={open}
          onClose={() => setOpen(false)}
          type="image"
          src={game.coverUrl}
          alt="Couverture du jeu"
        />
      </div>
    </section>
  );
}
