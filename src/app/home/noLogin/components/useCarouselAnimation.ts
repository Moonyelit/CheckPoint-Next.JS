// Types utilisés dans le composant HeroBanner

export interface Game {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
} 

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const isInitialized = useRef(false);

  // Fonction pour démarrer l'auto-play
  const startAutoPlay = useCallback(() => {
    if (total === 0) return;
    
    // Nettoyer l'intervalle existant
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Démarrer le nouvel intervalle
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);
  }, [total, autoPlayInterval]);

  // Fonction pour arrêter l'auto-play
  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Animation automatique
  useEffect(() => {
    if (total === 0) return;

    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [isAutoPlaying, total, startAutoPlay, stopAutoPlay]);

  // Initialisation de l'auto-play au premier rendu
  useEffect(() => {
    if (total > 0 && !isInitialized.current) {
      isInitialized.current = true;
      setIsAutoPlaying(true);
    }
  }, [total]);

  // Arrêter l'auto-play lors de l'interaction et reprendre après le délai
  const handleUserInteraction = useCallback(() => {
    if (total === 0) return;
    
    setIsAutoPlaying(false);
    stopAutoPlay();
    
    // Nettoyer le timeout existant
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reprendre l'auto-play après le délai
    timeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      timeoutRef.current = null;
    }, resumeDelay);
  }, [resumeDelay, stopAutoPlay, total]);

  // Nettoyage des timers au démontage
  useEffect(() => {
    return () => {
      stopAutoPlay();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [stopAutoPlay]);

  // Actions du carrousel
  const goToNext = useCallback(() => {
    if (total === 0) return;
    handleUserInteraction();
    setActiveIndex((i) => (i + 1) % total);
  }, [handleUserInteraction, total]);

  const goToPrev = useCallback(() => {
    if (total === 0) return;
    handleUserInteraction();
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [handleUserInteraction, total]);

  const goToIndex = useCallback((idx: number) => {
    if (total === 0) return;
    handleUserInteraction();
    setActiveIndex(idx);
  }, [handleUserInteraction, total]);

  // Calcul des classes CSS pour chaque carte
  const getCardClass = useCallback((idx: number): string => {
    if (total === 0) return "box";
    
    const relative = (idx - activeIndex + total) % total;
    if (relative === 0) return "box active";
    if (relative === 1) return "box right";
    if (relative === total - 1) return "box left";
    if (relative === 2) return "box right-hidden";
    if (relative === total - 2) return "box left-hidden";
    return "box box--hide";
  }, [activeIndex, total]);

  return {
    currentIndex: activeIndex,
    isAutoPlaying,
    goToNext,
    goToPrev,
    goToIndex,
    getCardClass,
    handleUserInteraction
  };
} 