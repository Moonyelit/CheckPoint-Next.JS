'use client';

import { useState, useEffect } from 'react';
import { GameCache } from '@/lib/cache';

// Vérifier si on est côté client
const isClient = typeof window !== 'undefined';

export default function CacheDebugger() {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher seulement en développement et côté client
    if (process.env.NODE_ENV !== 'development' || !isClient) {
      return;
    }

    const updateStats = () => {
      try {
        setStats(GameCache.getStats());
      } catch (error) {
        console.warn('Erreur lors de la récupération des stats du cache:', error);
      }
    };

    // Mettre à jour les stats toutes les 2 secondes
    const interval = setInterval(updateStats, 2000);
    updateStats(); // Première mise à jour

    return () => clearInterval(interval);
  }, []);

  // Masquer en production ou côté serveur
  if (process.env.NODE_ENV !== 'development' || !isClient) {
    return null;
  }

  const handleClearCache = async () => {
    try {
      await GameCache.clear();
      setStats(GameCache.getStats());
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error);
    }
  };

  const handleCleanupServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_CLEANUP'
        });
      }
    } catch (error) {
      console.warn('Erreur lors du nettoyage du Service Worker:', error);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          zIndex: 9999,
          fontSize: '12px'
        }}
        title="Debug Cache"
      >
        🗄️
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#2c3e50',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        minWidth: '200px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong>Cache Debug</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
      </div>
      
      {stats && (
        <div style={{ marginBottom: '10px' }}>
          <div>📊 {stats.usage}</div>
          <div style={{ 
            background: '#34495e', 
            height: '4px', 
            borderRadius: '2px',
            marginTop: '5px'
          }}>
            <div 
              style={{
                background: stats.size / stats.maxSize > 0.8 ? '#e74c3c' : '#27ae60',
                height: '100%',
                width: `${(stats.size / stats.maxSize) * 100}%`,
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={handleClearCache}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '5px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🗑️ Cache API
        </button>
        <button
          onClick={handleCleanupServiceWorker}
          style={{
            background: '#f39c12',
            color: 'white',
            border: 'none',
            padding: '5px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            flex: 1
          }}
        >
          🖼️ Cache Images
        </button>
      </div>
    </div>
  );
} 