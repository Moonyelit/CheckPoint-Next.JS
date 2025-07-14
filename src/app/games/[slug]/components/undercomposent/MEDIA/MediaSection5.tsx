import React, { useState } from "react";
import { Game } from "@/types/game";
import MediaOverlay from "./MediaOverlay";
import "./MediaSection5.scss";

interface MediaSection5Props {
  game: Game;
}

export default function MediaSection5({ game }: MediaSection5Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!game.videos || game.videos.length === 0) {
    return null;
  }

  return (
    <div className="media-section5">
      <div className="media-content__item">
        <h4 className="media-content__item-title">VIDEOS ({game.videos.length})</h4>
        <div className="media-content__videos-grid">
          {game.videos.map((video, index) => (
            <div key={index} className="media-content__video-item">
              <h5 className="media-content__video-item-title">{video.name}</h5>
              <div className="media-content__video" style={{ cursor: "pointer" }} onClick={() => setOpenIndex(index)}>
                <iframe
                  src={video.url.replace('watch?v=', 'embed/')}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="media-overlay__video"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
        {openIndex !== null && (
          <MediaOverlay
            open={true}
            onClose={() => setOpenIndex(null)}
            type="video"
            src={game.videos[openIndex].url.replace('watch?v=', 'embed/')}
            alt={game.videos[openIndex].name}
          />
        )}
      </div>
    </div>
  );
} 