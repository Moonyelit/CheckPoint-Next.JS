'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import LegalModal from './LegalModal';
import './styles/CookieConsent.scss';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

// Extension de l'interface Window pour la fonction de debug
declare global {
  interface Window {
    resetCookieConsent?: () => void;
  }
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { needsConsent, acceptCookies, declineCookies, resetConsent } = useCookieConsent();

  useEffect(() => {
    // Attendre un peu pour s'assurer que le localStorage est bien initialisé
    const timer = setTimeout(() => {
      setHasInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Afficher la popup seulement si le consentement n'a pas encore été donné ET que l'initialisation est terminée
    if (needsConsent && hasInitialized) {
      setIsVisible(true);
    } else if (!needsConsent) {
      setIsVisible(false);
    }
  }, [needsConsent, hasInitialized]);

  // Fonction de debug pour réinitialiser le consentement en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Ajouter une fonction globale pour réinitialiser le consentement
      window.resetCookieConsent = () => {
        resetConsent();
        setIsVisible(true);
      };
    }
  }, [resetConsent]);

  const handleAccept = () => {
    acceptCookies();
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    declineCookies();
    setIsVisible(false);
    onDecline?.();
  };

  const handleManage = () => {
    setShowDetails(!showDetails);
  };

  const handlePrivacyPolicy = () => {
    setIsLegalModalOpen(true);
  };

  // Ne pas afficher tant que l'initialisation n'est pas terminée
  if (!hasInitialized || !isVisible) {
    return null;
  }

  return (
    <>
      <div className="cookie-consent">
        <div className="cookie-consent__overlay" onClick={handleDecline} />
        <div className="cookie-consent__modal">
          <div className="cookie-consent__header">
            <div className="cookie-consent__icon">🍪</div>
            <h2 className="cookie-consent__title">Gestion des cookies</h2>
          </div>

          <div className="cookie-consent__content">
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur CheckPoint. 
              Ces cookies sont nécessaires au bon fonctionnement de l&apos;application.
            </p>

            {showDetails && (
              <div className="cookie-consent__details">
                <h3>Types de cookies utilisés :</h3>
                <ul>
                  <li>
                    <strong>Cookies de session :</strong> Maintiennent votre connexion et vos préférences
                  </li>
                  <li>
                    <strong>Cookies d&apos;authentification :</strong> Sécurisent votre accès à l&apos;application
                  </li>
                </ul>
                <p className="cookie-consent__note">
                  <strong>Note :</strong> Aucun cookie publicitaire ou de tracking n&apos;est utilisé. 
                  Tous les cookies sont automatiquement supprimés à la fermeture de votre navigateur.
                </p>
              </div>
            )}

            <div className="cookie-consent__actions">
              <button
                className="cookie-consent__btn cookie-consent__btn--secondary"
                onClick={handleManage}
              >
                {showDetails ? 'Masquer les détails' : 'Voir les détails'}
              </button>
              
              <div className="cookie-consent__main-actions">
                <button
                  className="cookie-consent__btn cookie-consent__btn--decline"
                  onClick={handleDecline}
                >
                  Refuser
                </button>
                <button
                  className="cookie-consent__btn cookie-consent__btn--accept"
                  onClick={handleAccept}
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>

          <div className="cookie-consent__footer">
            <p>
              En continuant à utiliser CheckPoint, vous acceptez notre{' '}
              <button 
                type="button"
                onClick={handlePrivacyPolicy}
                className="cookie-consent__link"
              >
                politique de confidentialité
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab="privacy"
      />
    </>
  );
} 