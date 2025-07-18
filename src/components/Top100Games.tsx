'use client';

import React, { useState, useEffect } from 'react';
import { fetchTop100Games, Top100GamesResponse, Top100GamesCriteria } from '@/services/top100GamesService';
import ResultsGame from '@/app/search/components/resultsGame';
import './Top100Games.scss';

const Top100Games: React.FC = () => {
  const [games, setGames] = useState<Top100GamesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Top100GamesCriteria>({
    minVotes: 200,
    minRating: 80,
    limit: 50
  });

  const loadGames = async (newCriteria: Top100GamesCriteria) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTop100Games(newCriteria);
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames(criteria);
  }, [criteria]);

  const handleCriteriaChange = (field: keyof Top100GamesCriteria, value: number) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetChange = (preset: 'popular' | 'aaa' | 'classic' | 'custom') => {
    switch (preset) {
      case 'popular':
        setCriteria({ minVotes: 100, minRating: 75, limit: 100 });
        break;
      case 'aaa':
        setCriteria({ minVotes: 500, minRating: 85, limit: 25 });
        break;
      case 'classic':
        setCriteria({ minVotes: 1000, minRating: 90, limit: 20 });
        break;
      case 'custom':
        // Garde les critères actuels
        break;
    }
  };

  if (loading) {
    return (
      <div className="top100-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du Top 100...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top100-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => loadGames(criteria)}>Réessayer</button>
      </div>
    );
  }

  if (!games) {
    return (
      <div className="top100-empty">
        <h2>Aucun jeu trouvé</h2>
        <p>Aucun jeu ne correspond aux critères actuels.</p>
      </div>
    );
  }

  return (
    <div className="top100-container">
      <header className="top100-header">
        <h1>🏆 Top {games.criteria.limit} Jeux</h1>
        
        {/* Statistiques */}
        <div className="top100-stats">
          <div className="stat-item">
            <span className="stat-label">Jeux trouvés :</span>
            <span className="stat-value">{games.totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Affichés :</span>
            <span className="stat-value">{games.games.length}</span>
          </div>
        </div>
      </header>

      {/* Contrôles des critères */}
      <section className="top100-controls">
        <h3>Critères de sélection</h3>
        
        {/* Presets rapides */}
        <div className="preset-buttons">
          <button
            className={`preset-btn ${criteria.minVotes === 100 && criteria.minRating === 75 ? 'active' : ''}`}
            onClick={() => handlePresetChange('popular')}
          >
            🎮 Populaires
          </button>
          <button
            className={`preset-btn ${criteria.minVotes === 500 && criteria.minRating === 85 ? 'active' : ''}`}
            onClick={() => handlePresetChange('aaa')}
          >
            ⭐ AAA
          </button>
          <button
            className={`preset-btn ${criteria.minVotes === 1000 && criteria.minRating === 90 ? 'active' : ''}`}
            onClick={() => handlePresetChange('classic')}
          >
            🏆 Classiques
          </button>
          <button
            className={`preset-btn ${!(criteria.minVotes === 100 || criteria.minVotes === 500 || criteria.minVotes === 1000) ? 'active' : ''}`}
            onClick={() => handlePresetChange('custom')}
          >
            ⚙️ Personnalisé
          </button>
        </div>

        {/* Contrôles personnalisés */}
        <div className="criteria-controls">
          <div className="control-group">
            <label htmlFor="minVotes">
              Votes minimum :
              <input
                id="minVotes"
                type="number"
                min="1"
                max="10000"
                value={criteria.minVotes}
                onChange={(e) => handleCriteriaChange('minVotes', parseInt(e.target.value) || 0)}
              />
            </label>
          </div>
          
          <div className="control-group">
            <label htmlFor="minRating">
              Note minimum (/100) :
              <input
                id="minRating"
                type="number"
                min="0"
                max="100"
                value={criteria.minRating}
                onChange={(e) => handleCriteriaChange('minRating', parseInt(e.target.value) || 0)}
              />
            </label>
          </div>
          
          <div className="control-group">
            <label htmlFor="limit">
              Nombre de jeux :
              <input
                id="limit"
                type="number"
                min="1"
                max="500"
                value={criteria.limit}
                onChange={(e) => handleCriteriaChange('limit', parseInt(e.target.value) || 1)}
              />
            </label>
          </div>
        </div>

        {/* Critères actuels */}
        <div className="current-criteria">
          <h4>Critères appliqués :</h4>
          <ul>
            <li>Note minimum : {games.criteria.minRating}/100</li>
            <li>Votes minimum : {games.criteria.minVotes}</li>
            <li>Limite : {games.criteria.limit} jeux</li>
          </ul>
        </div>
      </section>

      {/* Liste des jeux */}
      <section className="top100-games">
        <div className="games-grid">
          {games.games.map((game) => (
            <ResultsGame
              key={game.id}
              slug={game.slug}
              title={game.title}
              coverUrl={game.coverUrl}
              platforms={game.platforms.map(p => p.name)}
              score={game.totalRating}
              totalRatingCount={game.totalRatingCount}
              criteria={games.criteria}
              totalCount={games.totalCount}
            />
          ))}
        </div>
      </section>

      {/* Message si aucun jeu */}
      {games.games.length === 0 && (
        <div className="no-games">
          <h3>Aucun jeu trouvé</h3>
          <p>Aucun jeu ne correspond aux critères actuels. Essayez de réduire les critères.</p>
        </div>
      )}
    </div>
  );
};

export default Top100Games; 