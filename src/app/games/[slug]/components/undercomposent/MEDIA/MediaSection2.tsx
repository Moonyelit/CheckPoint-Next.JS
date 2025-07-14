import React, { useState } from "react";
import { Game } from "@/types/game";
import MediaOverlay from "./MediaOverlay";
import LazyImage from "@/components/common/LazyImage";
import "./MediaSection2.scss";

interface MediaSection2Props {
  game: Game;
}

export default function MediaSection2({ game }: MediaSection2Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!game.screenshots || game.screenshots.length === 0) {
    return null;
  }

  return (
    <div className="media-section2">
      <div className="media-content__item">
        <h4 className="media-content__item-title">SCREENSHOTS ({game.screenshots.length})</h4>
        <div className="media-content__screenshots">
          {game.screenshots.map((screenshot, index) => (
            <div
              key={index}
              onClick={() => setOpenIndex(index)}
              style={{ cursor: "pointer" }}
            >
              <LazyImage
                src={screenshot.image}
                alt={`Screenshot ${index + 1}`}
                className="media-content__item-image"
              />
            </div>
          ))}
        </div>
        {openIndex !== null && (
          <MediaOverlay
            open={true}
            onClose={() => setOpenIndex(null)}
            type="image"
            src={game.screenshots[openIndex].image}
            alt={`Screenshot ${openIndex + 1}`}
          />
        )}
      </div>
    </div>
  );
} 