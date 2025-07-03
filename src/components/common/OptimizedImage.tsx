'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getImageUrl } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Traitement de l'URL
  const processedSrc = src.startsWith('/') ? src : getImageUrl(src);

  // Intersection Observer pour le lazy loading
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    });
  }, []);

  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });

    const currentContainer = containerRef.current;
    observer.observe(currentContainer);

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, [handleIntersection, priority]);

  // Gestion du chargement
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoaded(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Nettoyage de l'image au démontage
  useEffect(() => {
    return () => {
      if (imgRef.current) {
        imgRef.current.src = '';
        imgRef.current.srcset = '';
      }
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  };

  if (hasError) {
    return (
      <div ref={containerRef} className={`optimized-image error ${className}`} style={containerStyle}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e0e0e0',
          color: '#666',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          Image non disponible
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`optimized-image ${className}`} style={containerStyle}>
      {/* Placeholder pendant le chargement */}
      {!isLoaded && isInView && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite'
        }} />
      )}

      {/* Image optimisée */}
      {isInView && (
        <img
          ref={imgRef}
          src={processedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'block'
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

// Styles CSS pour l'animation de chargement
const styles = `
  @keyframes loading {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 