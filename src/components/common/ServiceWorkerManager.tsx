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
    if (isLoading) {
      console.log('🔄 Service Worker en cours de chargement...');
    } else if (error) {
      console.error('❌ Erreur Service Worker:', error);
    } else if (isSupported && isInstalled) {
      console.log('✅ Service Worker actif et fonctionnel');
    } else if (!isSupported) {
      console.warn('⚠️ Service Worker non supporté par ce navigateur');
    }
  }, [isLoading, error, isSupported, isInstalled]);

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