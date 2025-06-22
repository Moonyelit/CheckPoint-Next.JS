/**
 * LazyImage - Composant d'image à chargement paresseux et optimisé.
 *
 * Ce composant a pour but d'améliorer les performances et l'expérience utilisateur
 * en ne chargeant les images que lorsqu'elles deviennent visibles à l'écran.
 *
 * Fonctionnalités clés :
 * 1. Lazy Loading : Utilise l'API `IntersectionObserver` pour différer le chargement
 *    des images qui ne sont pas encore dans la fenêtre d'affichage (viewport).
 * 2. Skeleton Placeholder : Affiche un squelette de chargement animé qui
 *    réserve l'espace de l'image pour éviter les décalages de mise en page (CLS).
 * 3. Fallback : Gère les erreurs de chargement (ex: image non trouvée) en
 *    affichant un message de remplacement propre.
 * 4. Transitions fluides : Applique des animations douces (fondu, échelle)
 *    lorsque l'image apparaît.
 *
 * Avantages :
 * - Réduit considérablement le temps de chargement initial de la page.
 * - Améliore les scores Core Web Vitals (LCP, CLS), bénéfique pour le SEO.
 * - Économise la bande passante de l'utilisateur.
 * - Offre une expérience de navigation plus fluide et professionnelle.
 */
import React, { useState, useEffect, useRef } from 'react';
import './styles/LazyImage.scss';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    ...(width && height ? { aspectRatio: `${width}/${height}` } : {})
  };

  return (
    <div
      ref={containerRef}
      className={`lazy-image ${isLoading ? 'loading' : ''} ${className}`}
      style={containerStyle}
    >
      {/* Skeleton loading */}
      {isLoading && (
        <div className="lazy-image__skeleton">
          <div className="lazy-image__skeleton-content" />
        </div>
      )}

      {/* Image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`lazy-image__img ${isLoading ? 'loading' : 'loaded'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Fallback pour les erreurs */}
      {hasError && (
        <div
          className="lazy-image__fallback"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--gris-fonce)',
            color: 'white',
            fontSize: '0.8rem',
            textAlign: 'center',
            padding: '0.5rem'
          }}
        >
          Image non disponible
        </div>
      )}
    </div>
  );
};

export default LazyImage; 