"use client";

import { useState } from 'react';
import './styles/GameActions.scss';

interface GameActionsProps {
  gameId: number;
  gameTitle: string;
}

export default function GameActions({ gameId, gameTitle }: GameActionsProps) {
  const [rating, setRating] = useState(0);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const handleRatingClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleAddToCollection = () => {
    setIsInCollection(!isInCollection);
    // TODO: Appel API pour ajouter/retirer de la collection
  };

  const handleAddToList = () => {
    setIsInList(!isInList);
    // TODO: Ouvrir modal pour choisir une liste
  };

  return (
    <div className="game-actions">
      <button 
        className={`game-actions__btn game-actions__btn--primary ${isInCollection ? 'game-actions__btn--active' : ''}`}
        onClick={handleAddToCollection}
      >
        {isInCollection ? 'Retirer de ma collection' : 'Ajouter à ma collection'}
      </button>
      
      <div className="game-actions__rating">
        <span className="game-actions__rating-label">Votre note :</span>
        <div className="game-actions__stars">
          {[0, 1, 2, 3, 4].map((starIndex) => (
            <button
              key={starIndex}
              className={`game-actions__star ${starIndex < rating ? 'game-actions__star--active' : ''}`}
              onClick={() => handleRatingClick(starIndex)}
              aria-label={`Noter ${starIndex + 1} étoile${starIndex > 0 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <button 
        className={`game-actions__btn game-actions__btn--secondary ${isInList ? 'game-actions__btn--active' : ''}`}
        onClick={handleAddToList}
      >
        {isInList ? 'Retirer de la liste' : 'Ajouter à une liste'}
      </button>
    </div>
  );
} 