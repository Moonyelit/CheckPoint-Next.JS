'use client';

import { useState, useEffect } from 'react';
import './styles/CacheMonitor.scss';

interface CacheStats {
  redis: {
    connected: boolean;
    memoryUsage?: number;
    keysCount?: number;
  };
  memory: {
    size: number;
    entries: number;
  };
}

export default function CacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Utiliser l'API pour récupérer les stats côté serveur
      const response = await fetch('/api/cache/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch('/api/cache/clear', { method: 'POST' });
      if (response.ok) {
        console.log('Cache vidé avec succès');
        await fetchStats(); // Rafraîchir les stats
      }
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
    }
  };

  useEffect(() => {
    // Charger les stats au montage
    fetchStats();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Afficher seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="cache-monitor">
      <button
        className="cache-monitor__toggle-button"
        onClick={() => setIsVisible(!isVisible)}
        title="Moniteur de cache"
      >
        🗄️
      </button>

      {isVisible && (
        <div className="cache-monitor__panel">
          <div className="cache-monitor__header">
            <h3>Moniteur de Cache</h3>
            <button
              className="cache-monitor__close-button"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>

          <div className="cache-monitor__content">
            {isLoading ? (
              <div className="cache-monitor__loading">Chargement...</div>
            ) : stats ? (
              <>
                <div className="cache-monitor__section">
                  <h4>Mémoire</h4>
                  <div className="cache-monitor__stat">
                    <span>Entrées:</span>
                    <span>{stats.memory.entries}</span>
                  </div>
                </div>

                <div className="cache-monitor__actions">
                  <button
                    className="cache-monitor__refresh-button"
                    onClick={fetchStats}
                    disabled={isLoading}
                  >
                    🔄 Rafraîchir
                  </button>
                  <button
                    className="cache-monitor__clear-button"
                    onClick={clearCache}
                    disabled={isLoading}
                  >
                    🗑️ Vider
                  </button>
                </div>
              </>
            ) : (
              <div className="cache-monitor__error">
                Impossible de charger les statistiques
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 