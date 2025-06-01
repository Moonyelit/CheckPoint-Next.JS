// src/app/home/noLogin/HeroBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Button from "@/components/common/Button";
import GameCard from "./GameCard";
import { useCarouselAnimation } from "./useCarouselAnimation";
import api from "@/lib/api";
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
    autoPlayInterval: 50000, // 5 secondes entre chaque carte
    resumeDelay: 80000 // Reprend après 8 secondes d'inactivité
  });

  // Récupération des 5 jeux populaires du moment (trending)
  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        // Utilise directement l'URL complète pour éviter les problèmes de configuration
        const data = await fetch('http://127.0.0.1:8000/api/games/trending?limit=5')
          .then(res => res.json());
        setCardsData(data);
      } catch (err) {
        console.error('Erreur fetch trending games :', err);
        // Fallback : essaie de récupérer les jeux de 2025 si trending échoue
        try {
          const year = 2025;
          const { data: fallbackData } = await api.get(`/api/games/top/${year}`, {
            params: { limit: 5 }
          });
          setCardsData(fallbackData);
        } catch (fallbackErr) {
          console.error('Erreur fallback :', fallbackErr);
        }
      }
    };
    fetchTrendingGames();
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
