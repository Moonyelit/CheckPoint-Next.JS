import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Game } from "@/types/game";
import LazyImage from "@/components/common/LazyImage";
import { getImageUrl } from "@/lib/imageUtils";
import "./FicheSection2.scss";

interface FicheSection2Props {
  game: Game;
}

// Définition d'un type minimal pour un screenshot
interface Screenshot {
  image: string;
}

export default function FicheSection2({ game }: FicheSection2Props) {
  // Récupération du trailer (YouTube ou autre)
  const firstVideo = game.videos && game.videos.length > 0 ? game.videos[0] : null;
  const trailerUrl = firstVideo ? firstVideo.url : (game.trailerUrl || "");
  let isYoutube = false;
  let embedUrl = trailerUrl;
  if (trailerUrl.includes("youtube.com/watch?v=")) {
    isYoutube = true;
    embedUrl = trailerUrl.replace("watch?v=", "embed/");
  } else if (trailerUrl.includes("youtu.be/")) {
    isYoutube = true;
    const videoId = trailerUrl.split("youtu.be/")[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Récupération des 4 premiers screenshots (si présents)
  const screenshots: Screenshot[] = Array.isArray((game as unknown as { screenshots?: Screenshot[] }).screenshots)
    ? ((game as unknown as { screenshots: Screenshot[] }).screenshots.slice(0, 4))
    : [];

  // État pour la lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const openLightbox = (img: string) => {
    setLightboxImg(img);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImg(null);
  };

  return (
    <section className="fiche-section2" aria-label="Médias du jeu">
      <div className="fiche-section2__container">
        {/* Colonne gauche : Vidéo */}
        <div className="fiche-section2__video-wrapper" role="region" aria-label="Trailer du jeu">
          {embedUrl ? (
            isYoutube ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={firstVideo?.name || 'Trailer du jeu'}
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            ) : (
              <video
                src={embedUrl}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                aria-label="Trailer du jeu"
              />
            )
          ) : (
            <div className="fiche-section2__no-trailer" role="status" aria-live="polite">
              Pas de trailer disponible
            </div>
          )}
        </div>

        {/* Colonne droite : Screenshots */}
        <div className="fiche-section2__screenshots-wrapper" role="region" aria-label="Captures d'écran du jeu">
          {screenshots.length > 0 ? (
            screenshots.map((shot, idx) => (
              <button
                key={idx}
                className="fiche-section2__screenshot-img-wrapper"
                onClick={() => openLightbox(shot.image)}
                aria-label={`Voir la capture d'écran ${idx + 1} en grand format`}
                type="button"
              >
                <LazyImage
                  src={shot.image}
                  alt={`Capture d'écran ${idx + 1} du jeu`}
                  className="fiche-section2__screenshot-img"
                />
              </button>
            ))
          ) : (
            <div className="fiche-section2__no-screenshots" role="status" aria-live="polite">
              Pas de screenshots disponibles
            </div>
          )}
        </div>
      </div>

      {/* Lightbox popup */}
      {lightboxOpen && lightboxImg && createPortal(
        <div
          className="fiche-section2__lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de la capture d'écran"
        >
          {getImageUrl(lightboxImg) ? (
            <img
              src={getImageUrl(lightboxImg)!}
              alt="Capture d'écran du jeu en grand format"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                color: '#666',
                fontSize: '16px',
                textAlign: 'center',
                padding: '20px'
              }}
              role="status"
              aria-live="polite"
            >
              Image non disponible
            </div>
          )}
          <button
            onClick={closeLightbox}
            aria-label="Fermer la vue agrandie"
            type="button"
          >
            ×
          </button>
        </div>,
        document.body
      )}
    </section>
  );
}
