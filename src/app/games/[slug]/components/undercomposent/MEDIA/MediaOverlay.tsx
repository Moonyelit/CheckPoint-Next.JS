import React from "react";
import { createPortal } from "react-dom";
import "./MediaOverlay.scss";

interface MediaOverlayProps {
  open: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
  alt?: string;
}

export default function MediaOverlay({ open, onClose, type, src, alt }: MediaOverlayProps) {
  if (!open) return null;

  const overlay = (
    <div className="media-overlay" onClick={onClose}>
      <div className="media-overlay__content" onClick={e => e.stopPropagation()}>
        <button className="media-overlay__close" onClick={onClose} aria-label="Fermer">&times;</button>
        {type === "image" ? (
          <img src={src} alt={alt} className="media-overlay__img" />
        ) : (
          <div className="media-overlay__video-wrapper">
            <iframe
              src={src}
              title={alt || "Vidéo"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="media-overlay__video"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
} 