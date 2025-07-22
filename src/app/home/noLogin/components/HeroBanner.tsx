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
        console.log('Début de fetchGames');
        console.log('URL API:', `${process.env.NEXT_PUBLIC_API_URL}/api/top_year_games`);
        console.log('isHydrated:', isHydrated);
        
        // Attendre que le composant soit hydraté
        if (!isHydrated) {
          console.log('Composant pas encore hydraté, attente...');
          return;
        }
        
        // Petit délai pour s'assurer que tout est prêt
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsLoading(true);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/top_year_games`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Ajouter des options pour éviter les problèmes CORS
          mode: 'cors',
          credentials: 'omit',
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Données reçues:', data);
          
          // Extraire les jeux de la propriété 'games' de la réponse
          if (data && data.games && Array.isArray(data.games) && data.games.length > 0) {
            console.log('Jeux extraits:', data.games);
            setCardsData(data.games);
          } else {
            console.log('Aucun jeu trouvé dans la réponse ou structure invalide');
            setCardsData([]);
          }
        } else {
          console.error('Erreur HTTP:', response.status, response.statusText);
          setCardsData([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des jeux:', error);
        setCardsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [isHydrated]);

  // Configuration des gestes de swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => goToNext?.(),
    onSwipedRight: () => goToPrev?.(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // État de chargement
  if (!isHydrated || isLoading) {
    return (
      <section className="hero-banner" aria-label="Bannière principale">
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
    <section className="hero-banner" aria-label="Bannière principale avec carrousel de jeux">
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
          <div 
            className="hero-banner__cards" 
            {...handlers}
            role="region"
            aria-label="Carrousel des meilleurs jeux de l'année"
            aria-live="polite"
          >
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
                <div className="hero-banner__card hero-banner__card--active" role="status" aria-live="polite">
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
              <div className="hero-banner__controls" role="group" aria-label="Contrôles du carrousel">
                <button 
                  onClick={goToPrev} 
                  className="hero-banner__button"
                  aria-label="Jeu précédent"
                  type="button"
                >
                  &lt;
                </button>
                <button 
                  onClick={goToNext} 
                  className="hero-banner__button"
                  aria-label="Jeu suivant"
                  type="button"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
