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
    <section className="hero-container">
        <div className="hero-content-container main-container">
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="Title1-Karantina">Parce que chaque partie mérite d&apos;être sauvegardée</h1>
              <p className="Paragraphe1">
                La plateforme gamifiée pour suivre ta progression et gérer ta
                collection de jeux vidéo
              </p>
              <Button label="S'inscrire" />
            </div>
          </div>
          <div className="hero-right">
            <div className="cards-wrapper" {...handlers}>
              <div className="cards__container">
                {cardsData.map((game, idx) => (
                  <div
                    key={game.id}
                    className={getCardClass(idx)}
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
              <div className="carousel-controls">
                <button onClick={goToPrev} className="button">&lt;</button>
                <button onClick={goToNext} className="button">&gt;</button>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
