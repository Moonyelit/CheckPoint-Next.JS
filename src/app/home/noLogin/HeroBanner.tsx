// src/app/home/noLogin/HeroBanner.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Button from "@/components/common/Button";
import GameCard from "./GameCard";
import api from "@/lib/api";
import "./HeroBanner.css";

interface Game {
  id: number;
  title: string;
  coverUrl: string;
  releaseDate: string;
}

export default function HeroBanner() {
  const [cardsData, setCardsData] = useState<Game[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = cardsData.length;

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const year = 2025;
        const { data } = await api.get(`/api/games/top/${year}`, {
          params: { limit: 5 }
        });
        setCardsData(data);
      } catch (err) {
        console.error('Erreur axios top games :', err);
      }
    };
    fetchTopGames();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft:  () => setActiveIndex((i) => (i + 1) % total),
    onSwipedRight: () => setActiveIndex((i) => (i - 1 + total) % total),
    trackMouse: true,
  });

  const prevCard = () => setActiveIndex((i) => (i - 1 + total) % total);
  const nextCard = () => setActiveIndex((i) => (i + 1) % total);

  function getCardClass(idx: number): string {
    const relative = (idx - activeIndex + total) % total;
    if (relative === 0) return "box active";
    if (relative === 1) return "box right";
    if (relative === total - 1) return "box left";
    if (relative === 2) return "box right-hidden";
    if (relative === total - 2) return "box left-hidden";
    return "box box--hide";
  }

  return (
    <section className="hero-container">
      <div className="hero-overlay">
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
                  onClick={() => setActiveIndex(idx)}
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
              <button onClick={prevCard} className="button">&lt;</button>
              <button onClick={nextCard} className="button">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
