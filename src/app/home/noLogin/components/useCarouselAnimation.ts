// Types utilisés dans le composant HeroBanner

export interface Game {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
} 

import { useState, useEffect, useRef } from 'react';

interface CarouselConfig {
  autoPlayInterval?: number;
  resumeDelay?: number;
}

export function useCarouselAnimation(total: number, config: CarouselConfig = {}) {
  const { autoPlayInterval = 4000, resumeDelay = 8000 } = config;
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation automatique
  useEffect(() => {
    if (!isAutoPlaying || total === 0) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, total, autoPlayInterval]);

  // Arrêter l'auto-play lors de l'interaction et reprendre après le délai
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, resumeDelay);
  };

  // Nettoyage des timers au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Actions du carrousel
  const goToNext = () => {
    handleUserInteraction();
    setActiveIndex((i) => (i + 1) % total);
  };

  const goToPrev = () => {
    handleUserInteraction();
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const goToIndex = (idx: number) => {
    handleUserInteraction();
    setActiveIndex(idx);
  };

  // Calcul des classes CSS pour chaque carte
  const getCardClass = (idx: number): string => {
    const relative = (idx - activeIndex + total) % total;
    if (relative === 0) return "box active";
    if (relative === 1) return "box right";
    if (relative === total - 1) return "box left";
    if (relative === 2) return "box right-hidden";
    if (relative === total - 2) return "box left-hidden";
    return "box box--hide";
  };

  return {
    activeIndex,
    isAutoPlaying,
    goToNext,
    goToPrev,
    goToIndex,
    getCardClass,
    handleUserInteraction
  };
} 