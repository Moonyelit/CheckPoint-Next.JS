// src/app/home/noLogin/HeroBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Button from "@/components/common/Button";
import GameCard from "./GameCard";
import { useCarouselAnimation } from "./useCarouselAnimation";
import "./HeroBanner.scss";

interface Game {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
  slug: string;
}

// HeroBanner est le composant principal de la page d'accueil
export default function HeroBanner() {
  const [cardsData, setCardsData] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const total = cardsData.length;

  // Vérification de l'hydratation côté client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Hook custom pour l'animation du carrousel - seulement si on a des données
  const carouselAnimation = useCarouselAnimation(total, {
    autoPlayInterval: 5000, // 5 secondes entre chaque carte
    resumeDelay: 8000 // Reprend après 8 secondes d'inactivité
  });

  // Destructuration sécurisée
  const {
    goToNext,
    goToPrev,
    goToIndex,
    getCardClass,
    currentIndex
  } = carouselAnimation || {};

  // Fonction pour convertir les anciennes classes en BEM
  const getBemCardClass = (index: number) => {
    if (!getCardClass) return 'hero-banner__card';
    
    const oldClass = getCardClass(index);
    // Conversion des anciennes classes vers BEM
    if (oldClass.includes('active')) return 'hero-banner__card hero-banner__card--active';
    if (oldClass.includes('right-hidden')) return 'hero-banner__card hero-banner__card--right-hidden';
    if (oldClass.includes('left-hidden')) return 'hero-banner__card hero-banner__card--left-hidden';
    if (oldClass.includes('right')) return 'hero-banner__card hero-banner__card--right';
    if (oldClass.includes('left')) return 'hero-banner__card hero-banner__card--left';
    if (oldClass.includes('box--hide')) return 'hero-banner__card hero-banner__card--hide';
    return 'hero-banner__card';
  };

  // Gestionnaire de clic sur une carte
  const handleCardClick = (index: number) => {
    if (goToIndex) {
      goToIndex(index);
    }
  };

  // Récupération des 5 meilleurs jeux de l'année
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/top_year_games`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.games && data.games.length > 0) {
            setCardsData(data.games);
          } else {
            setCardsData([]);
          }
        } else {
          setCardsData([]);
        }
        
      } catch (err) {
        console.error('Erreur lors de la récupération des jeux :', err);
        setCardsData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, []);

  // Gestion des gestes de swipe pour le carrousel
  const handlers = useSwipeable({
    onSwipedLeft: goToNext || (() => {}),
    onSwipedRight: goToPrev || (() => {}),
    trackMouse: true,
  });

  // Si pas encore hydraté, afficher un skeleton
  if (!isHydrated) {
    return (
      <section className="hero-banner">
        <div className="hero-banner__container main-container">
          <div className="hero-banner__left">
            <div className="hero-banner__content">
              <h1 className="Title1-Karantina">Parce que chaque partie mérite d&apos;être sauvegardée</h1>
              <p className="Paragraphe1">
                La plateforme gamifiée pour suivre ta progression et gérer ta
                collection de jeux vidéo
              </p>
              <Button label="S'inscrire" />
            </div>
          </div>
          <div className="hero-banner__right">
            <div className="hero-banner__cards">
              <div className="hero-banner__cards-wrapper">
                <div className="hero-banner__card hero-banner__card--active">
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #748599 0%, #a8bbc5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '1rem'
                  }}>
                    Chargement...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si pas de données, afficher un message ou un skeleton
  if (isLoading) {
    return (
      <section className="hero-banner">
        <div className="hero-banner__container main-container">
          <div className="hero-banner__left">
            <div className="hero-banner__content">
              <h1 className="Title1-Karantina">Parce que chaque partie mérite d&apos;être sauvegardée</h1>
              <p className="Paragraphe1">
                La plateforme gamifiée pour suivre ta progression et gérer ta
                collection de jeux vidéo
              </p>
              <Button label="S'inscrire" />
            </div>
          </div>
          <div className="hero-banner__right">
            <div className="hero-banner__cards">
              <div className="hero-banner__cards-wrapper">
                <div className="hero-banner__card hero-banner__card--active">
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #748599 0%, #a8bbc5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '1rem'
                  }}>
                    Chargement...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // S'assurer que le carrousel ne se rend que quand tout est prêt
  const isReady = isHydrated && !isLoading && cardsData.length > 0;

  return (
    <section className="hero-banner">
      <div className="hero-banner__container main-container">
        <div className="hero-banner__left">
          <div className="hero-banner__content">
            <h1 className="Title1-Karantina">Parce que chaque partie mérite d&apos;être sauvegardée</h1>
            <p className="Paragraphe1">
              La plateforme gamifiée pour suivre ta progression et gérer ta
              collection de jeux vidéo
            </p>
            <Button label="S'inscrire" />
          </div>
        </div>
        <div className="hero-banner__right">
          <div className="hero-banner__cards" {...handlers}>
            <div className="hero-banner__cards-wrapper">
              {isReady ? (
                cardsData.map((game, idx) => (
                  <div
                    key={game.id}
                    className={getBemCardClass(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <GameCard
                      title={game.title}
                      subtitle={new Date(game.releaseDate).toLocaleDateString("fr-FR")}
                      imageUrl={game.coverUrl}
                      alt={game.title}
                      slug={game.slug}
                      isActive={idx === currentIndex}
                      onCardClick={handleCardClick}
                      index={idx}
                    />
                  </div>
                ))
              ) : (
                <div className="hero-banner__card hero-banner__card--active">
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #748599 0%, #a8bbc5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '1rem'
                  }}>
                    Aucun jeu disponible
                  </div>
                </div>
              )}
            </div>
            {isReady && cardsData.length > 1 && (
              <div className="hero-banner__controls">
                <button onClick={goToPrev} className="hero-banner__button">&lt;</button>
                <button onClick={goToNext} className="hero-banner__button">&gt;</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
