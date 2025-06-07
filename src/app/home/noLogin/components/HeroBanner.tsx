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
}

// HeroBanner est le composant principal de la page d'accueil
export default function HeroBanner() {
  const [cardsData, setCardsData] = useState<Game[]>([]);
  const total = cardsData.length;

  // Hook custom pour l'animation du carrousel
  const {
    goToNext,
    goToPrev,
    goToIndex,
    getCardClass
  } = useCarouselAnimation(total, {
    autoPlayInterval: 5000, // 5 secondes entre chaque carte
    resumeDelay: 8000 // Reprend après 8 secondes d'inactivité
  });

  // Fonction pour convertir les anciennes classes en BEM
  const getBemCardClass = (index: number) => {
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

  // Récupération des 5 meilleurs jeux avec système de fallback simplifié
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // 1er choix : Top 30 jeux de l'année (365 derniers jours, 100+ votes, note 75+)
        console.log('🎮 Tentative de récupération des jeux de l\'année...');
        const yearData = await fetch('http://127.0.0.1:8000/api/games/top100-year?limit=5')
          .then(res => res.json());
        
        if (yearData && yearData.length > 0) {
          console.log('✅ Jeux de l\'année récupérés :', yearData.map((g: Game) => g.title));
          setCardsData(yearData);
          return;
        }
        
        throw new Error('Aucun jeu de l\'année trouvé');
        
      } catch (err) {
        console.error('❌ Erreur jeux de l\'année :', err);
        
        // 2ème choix : Top 100 de tous les temps (50+ votes, note 85+)
        try {
          console.log('🏆 Fallback vers Top 100 de tous les temps...');
          const top100Data = await fetch('http://127.0.0.1:8000/api/games/top100?limit=5')
            .then(res => res.json());
            
          if (top100Data && top100Data.length > 0) {
            console.log('✅ Top 100 récupéré :', top100Data.map((g: Game) => g.title));
            setCardsData(top100Data);
            return;
          }
          
          throw new Error('Aucun jeu Top 100 trouvé');
          
        } catch (finalErr) {
          console.error('❌ Échec total des deux endpoints de qualité :', finalErr);
          // Aucun fallback supplémentaire - affichage vide si les deux endpoints échouent
          setCardsData([]);
        }
      }
    };
    
    fetchGames();
  }, []);

  // Gestion des gestes de swipe pour le carrousel
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
    trackMouse: true,
  });

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
              {cardsData.map((game, idx) => (
                <div
                  key={game.id}
                  className={getBemCardClass(idx)}
                  onClick={() => goToIndex(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <GameCard
                    title={game.title}
                    subtitle={new Date(game.releaseDate).toLocaleDateString("fr-FR")}
                    imageUrl={game.coverUrl}
                    alt={game.title}
                  />
                </div>
              ))}
            </div>
            <div className="hero-banner__controls">
              <button onClick={goToPrev} className="hero-banner__button">&lt;</button>
              <button onClick={goToNext} className="hero-banner__button">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
