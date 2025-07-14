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
    <div className="media-section1">
      <div className="media-content__item">
        <h4 className="media-content__item-title">COUVERTURE</h4>
        <img 
          src={game.coverUrl} 
          alt="Couverture du jeu"
          className="media-content__item-image"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        />
        <MediaOverlay
          open={open}
          onClose={() => setOpen(false)}
          type="image"
          src={game.coverUrl}
          alt="Couverture du jeu"
        />
      </div>
    </div>
  );
}
