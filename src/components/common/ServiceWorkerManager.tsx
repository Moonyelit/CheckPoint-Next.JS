'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import './styles/ServiceWorkerManager.scss';

export default function ServiceWorkerManager() {
  const { 
    isSupported, 
    isInstalled, 
    isUpdated, 
    isLoading, 
    error,
    updateServiceWorker,
    clearCache 
  } = useServiceWorker();

  // Afficher les logs de statut
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        if (registration.active) {
          // Service Worker actif et fonctionnel
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      }
    };

    registerSW();
  }, []);

  // Notification de mise à jour
  if (isUpdated) {
    return (
      <div className="sw-update-notification">
        <div className="sw-update-content">
          <div className="sw-update-icon">🔄</div>
          <div className="sw-update-text">
            <h3>Nouvelle version disponible</h3>
            <p>Une mise à jour de l'application est prête à être installée.</p>
          </div>
          <div className="sw-update-actions">
            <button 
              onClick={updateServiceWorker}
              className="sw-update-btn sw-update-btn--primary"
            >
              Mettre à jour
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="sw-update-btn sw-update-btn--secondary"
            >
              Recharger
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Notification d'erreur
  if (error) {
    return (
      <div className="sw-error-notification">
        <div className="sw-error-content">
          <div className="sw-error-icon">⚠️</div>
          <div className="sw-error-text">
            <h3>Erreur Service Worker</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="sw-error-btn"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Pas de notification si tout va bien
  return null;
} 