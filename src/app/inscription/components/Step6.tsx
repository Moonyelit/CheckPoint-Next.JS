"use client";
import React, { useState, useEffect } from "react";
import { safeLocalStorageSet, getAuthToken } from "@/utils/auth";
import "../styles/Step6.scss";

interface Game {
  id: number;
  title: string;
  coverUrl: string;
  developer: string;
  genres: string[];
  totalRating: number; 
}

interface Wallpaper {
  id: number;
  image: string;
  game: Game;
}

interface Step6Props {
  onNext: () => void;
}

const Step6 = ({ onNext }: Step6Props) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [selectedWallpapers, setSelectedWallpapers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrer pour n'avoir qu'un seul wallpaper par image (évite les doublons)
  const uniqueWallpapers = React.useMemo(() => {
    return Array.from(new Map(wallpapers.map(w => [w.image, w])).values());
  }, [wallpapers]);

  // Marquer qu'on est à l'étape 6
  React.useEffect(() => {
    safeLocalStorageSet("inscriptionStep", "6");
  }, []);

  // Charger les wallpapers disponibles
  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallpapers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setWallpapers(data.wallpapers || []);
        } else {
          setError('Erreur lors du chargement des wallpapers');
        }
      } catch (err) {
        console.error('Erreur réseau:', err);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  const handleWallpaperSelect = async (wallpaperId: number) => {
    const token = getAuthToken();
    if (!token) {
      setError('Vous devez être connecté pour sélectionner des wallpapers');
      return;
    }

    try {
      const isSelected = selectedWallpapers.has(wallpaperId);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wallpapers/${wallpaperId}/${isSelected ? 'unselect' : 'select'}`;
      const method = isSelected ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newSelectedWallpapers = new Set(selectedWallpapers);
        if (isSelected) {
          newSelectedWallpapers.delete(wallpaperId);
        } else {
          newSelectedWallpapers.add(wallpaperId);
        }
        setSelectedWallpapers(newSelectedWallpapers);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la sélection');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    }
  };

  const handleContinue = () => {
    // Marquer qu'on passe à l'étape 7
    safeLocalStorageSet("inscriptionStep", "7");
    onNext();
  };

  // Bouton "Passer cette étape et continuer" : sélectionne tout par défaut
  const handleSkip = () => {
    // Ici, on peut soit tout sélectionner, soit ne rien sélectionner selon la logique métier
    // Ici, on considère que l'utilisateur aura accès à tous les wallpapers (aucune restriction)
    safeLocalStorageSet("inscriptionStep", "7");
    onNext();
  };

  if (loading) {
    return (
      <div className="step6">
        <div className="step6__form-container">
          <div className="step6__loading">
            <div className="step6__loading-spinner"></div>
            <p>Chargement des wallpapers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step6">
        <div className="step6__form-container">
          <div className="step6__error">
            <p>{error}</p>
            <button 
              className="btn-custom step6__retry-button" 
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step6">
      <div className="step6__form-container">
        <header className="step6__header">
          <div className="step6__quest-label">
            Quête du tutoriel (2 sur 3)
          </div>
          <h1 className="step6__title">Zone de départ</h1>
          <p className="step6__description">
            Vous avez sélectionné l&apos;apparence de votre avatar, mais qu&apos;en est-il
            de l&apos;univers qui vous entoure ? Sélectionnez vos univers de jeu
            préférés pour que ce style soit reflété sur votre profil.
          </p>
          <p className="step6__selection-info">
            {selectedWallpapers.size > 0 
              ? `${selectedWallpapers.size} wallpaper${selectedWallpapers.size > 1 ? 's' : ''} sélectionné${selectedWallpapers.size > 1 ? 's' : ''}`
              : "Aucun wallpaper sélectionné - les wallpapers seront choisis aléatoirement"
            }
          </p>
        </header>

        <div className="step6__actions">
          <button 
            className="btn-custom-inverse step6__continue-button" 
            onClick={handleContinue}
            aria-label="Continuer vers l'étape suivante"
          >
            Sauver et continuer
          </button>
          <button
            className=" step6__continue-button-skip"
            onClick={handleSkip}
            aria-label="Passer cette étape et continuer"
          >
            Passer cette étape et continuer
          </button>
        </div>

        <div className="step6__content">
          {uniqueWallpapers.length > 0 ? (
            <div className="step6__wallpapers-grid">
              {uniqueWallpapers.map((wallpaper) => (
                <div 
                  key={wallpaper.id} 
                  className={`step6__wallpaper-card ${selectedWallpapers.has(wallpaper.id) ? 'step6__wallpaper-card--selected' : ''}`}
                  onClick={() => handleWallpaperSelect(wallpaper.id)}
                >
                  <div className="step6__wallpaper-cover step6__wallpaper-cover--small">
                    <img 
                      src={wallpaper.game.coverUrl} 
                      alt={wallpaper.game.title}
                      className="step6__cover-image step6__cover-image--small"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-game-cover.png';
                      }}
                    />
                    <div className="step6__wallpaper-overlay">
                      <div className="step6__selection-indicator">
                        {selectedWallpapers.has(wallpaper.id) ? '✓' : '+'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="step6__no-wallpapers">
              <p>Aucun wallpaper disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step6;
