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
    <div 
      className="media-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Vue agrandie ${type === 'image' ? 'de l\'image' : 'de la vidéo'}`}
    >
      <div className="media-overlay__content" onClick={e => e.stopPropagation()}>
        <button 
          className="media-overlay__close" 
          onClick={onClose} 
          aria-label="Fermer la vue agrandie"
          type="button"
        >
          &times;
        </button>
        {type === "image" ? (
          <img src={src} alt={alt || "Image en grand format"} className="media-overlay__img" />
        ) : (
          <div className="media-overlay__video-wrapper">
            <iframe
              src={src}
              title={alt || "Vidéo en grand format"}
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