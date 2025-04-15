// src/app/home/noLogin/HeroBanner.tsx
"use client";
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable"; // Import de react-swipeable
import Button from "@/components/common/Button";
import GameCard from "./GameCard";
import "./HeroBanner.css";

const cardsData = [
  {
    title: "Balatro",
    subtitle: "20 February 2024",
    imageUrl: "/images/games/balatro.jpg",
    alt: "Balatro",
  },
  {
    title: "Monster Hunter Wilds",
    subtitle: "Réservez votre chasse",
    imageUrl: "/images/games/monster-hunter-wilds.jpg",
    alt: "Monster Hunter Wilds",
  },
  {
    title: "Split Fiction",
    subtitle: "En développement",
    imageUrl: "/images/games/split-fiction.jpg",
    alt: "Split Fiction",
  },
  {
    title: "Split Fiction",
    subtitle: "En développement",
    imageUrl: "/images/games/split-fiction.jpg",
    alt: "Split Fiction",
  },
  {
    title: "Split Fiction",
    subtitle: "En développement",
    imageUrl: "/images/games/split-fiction.jpg",
    alt: "Split Fiction",
  },
];

function getCardClass(
  cardIndex: number,
  activeIndex: number,
  total: number
): string {
  const relative = (cardIndex - activeIndex + total) % total;
  if (total === 4) {
    switch (relative) {
      case 0:
        return "box active";
      case 1:
        return "box right";
      case 2:
        return "box right-hidden";
      case 3:
        return "box left";
      default:
        return "box box--hide";
    }
  }
  if (relative === 0) return "box active";
  if (relative === 1) return "box right";
  if (relative === total - 1) return "box left";
  if (relative === 2) return "box right-hidden";
  if (relative === total - 2) return "box left-hidden";
  return "box box--hide";
}

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = cardsData.length;

  // Gestionnaire de swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setActiveIndex((prev) => (prev + 1) % total); // Swipe vers la gauche
    },
    onSwipedRight: () => {
      setActiveIndex((prev) => (prev - 1 + total) % total); // Swipe vers la droite
    },
    trackMouse: true, // Permet de suivre les mouvements de la souris
  });

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="hero-container">
      <div className="hero-overlay">
        <div className="hero-left">
          <div className="hero-content">
            <h1>Parce que chaque partie mérite d&apos;être sauvegardée</h1>
            <p>
              La plateforme gamifiée pour suivre ta progression et gérer ta
              collection de jeux vidéo
            </p>
            <Button label="S'inscrire" />
          </div>
        </div>

        <div className="hero-right">
          <div className="cards-wrapper" {...handlers}>
            <div className="cards__container">
              {cardsData.map((card, index) => (
                <div
                  key={index}
                  className={getCardClass(index, activeIndex, total)}
                  onClick={() => handleCardClick(index)}
                >
                  <GameCard
                    title={card.title}
                    subtitle={card.subtitle}
                    imageUrl={card.imageUrl}
                    alt={card.alt}
                  />
                </div>
              ))}
            </div>
            <div className="carousel-controls">
              <button onClick={prevCard} className="button">
                &lt;
              </button>
              <button onClick={nextCard} className="button">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
