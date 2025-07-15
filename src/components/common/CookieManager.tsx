'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import './styles/CookieManager.scss';

export default function CookieManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasEverConsented, setHasEverConsented] = useState(false);
  const { consentData, hasConsented, hasDeclined, resetConsent } = useCookieConsent();

  // Marquer qu'un consentement a été donné au moins une fois
  useEffect(() => {
    if (consentData.status) {
      setHasEverConsented(true);
    }
  }, [consentData.status]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    resetConsent();
    handleClose(); // Fermer le modal
    
    // Forcer la réapparition de CookieConsent après un court délai
    setTimeout(() => {
      // Forcer un re-render pour que CookieConsent détecte le changement
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cookieConsent',
        newValue: null
      }));
    }, 100);
  };

  // Afficher le bouton si un consentement a été donné OU si on est en train de modifier
  const shouldShowButton = hasEverConsented || isOpen;

  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <button
        className="cookie-manager__trigger"
        onClick={handleOpen}
        title="Gérer les cookies"
      >
        🍪
      </button>

      {isOpen && (
        <div className="cookie-manager">
          <div className="cookie-manager__overlay" onClick={handleClose} />
          <div className="cookie-manager__modal">
            <div className="cookie-manager__header">
              <h3>Gestion des cookies</h3>
              <button
                className="cookie-manager__close"
                onClick={handleClose}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="cookie-manager__content">
              <div className="cookie-manager__status">
                <h4>Statut actuel :</h4>
                <div className={`cookie-manager__status-badge ${
                  hasConsented ? 'cookie-manager__status-badge--accepted' : 
                  hasDeclined ? 'cookie-manager__status-badge--declined' : 
                  'cookie-manager__status-badge--unknown'
                }`}>
                  {hasConsented ? '✅ Acceptés' : 
                   hasDeclined ? '❌ Refusés' : 
                   '❓ Non défini'}
                </div>
                {consentData.date && (
                  <p className="cookie-manager__date">
                    Dernière mise à jour : {new Date(consentData.date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              <div className="cookie-manager__info">
                <h4>Informations :</h4>
                <ul>
                  <li>Nous utilisons uniquement des cookies nécessaires au fonctionnement</li>
                  <li>Aucun cookie publicitaire ou de tracking</li>
                  <li>Les cookies sont automatiquement supprimés à la fermeture du navigateur</li>
                  <li>Vous pouvez modifier vos préférences à tout moment</li>
                </ul>
              </div>

              <div className="cookie-manager__actions">
                <button
                  className="cookie-manager__btn cookie-manager__btn--secondary"
                  onClick={handleReset}
                >
                  Modifier mes préférences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 