import React, { useState } from "react";
import { Game } from "@/types/game";
import MediaOverlay from "./MediaOverlay";
import "./MediaSection4.scss";

interface MediaSection4Props {
  game: Game;
}

export default function MediaSection4({ game }: MediaSection4Props) {
  const [open, setOpen] = useState(false);
  if (!game.trailerUrl) {
    return null;
  }

  const embedUrl = game.trailerUrl.replace('watch?v=', 'embed/');

  return (
    <div className="media-section4">
      <div className="media-content__item">
        <h4 className="media-content__item-title">TRAILER</h4>
        <div className="media-content__video" style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
          <iframe
            src={embedUrl}
            title="Trailer du jeu"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="media-overlay__video"
          ></iframe>
        </div>
        <MediaOverlay
          open={open}
          onClose={() => setOpen(false)}
          type="video"
          src={embedUrl}
          alt="Trailer du jeu"
        />
      </div>
    </div>
  );
} 