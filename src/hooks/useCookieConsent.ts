'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CookieConsentData {
  status: 'accepted' | 'declined' | null;
  date: string | null;
}

export function useCookieConsent() {
  const [consentData, setConsentData] = useState<CookieConsentData>({
    status: null,
    date: null
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction pour vérifier le consentement
  const checkConsent = useCallback(() => {
    const status = localStorage.getItem('cookieConsent');
    const date = localStorage.getItem('cookieConsentDate');
    
    setConsentData({
      status: status as 'accepted' | 'declined' | null,
      date
    });
  }, []);

  useEffect(() => {
    // Ne vérifier le consentement que côté client
    if (!isClient) return;

    // Vérifier le consentement au chargement
    checkConsent();

    // Écouter les changements de localStorage (pour les autres onglets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent' || e.key === 'cookieConsentDate') {
        checkConsent();
      }
    };

    // Écouter les changements de localStorage dans le même onglet
    const handleLocalStorageChange = () => {
      checkConsent();
    };

    // Créer un proxy pour détecter les changements de localStorage
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key: string, value: string) {
      originalSetItem.call(this, key, value);
      if (key === 'cookieConsent' || key === 'cookieConsentDate') {
        handleLocalStorageChange();
      }
    };

    localStorage.removeItem = function(key: string) {
      originalRemoveItem.call(this, key);
      if (key === 'cookieConsent' || key === 'cookieConsentDate') {
        handleLocalStorageChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // Restaurer les méthodes originales
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, [isClient, checkConsent]);

  const acceptCookies = () => {
    const now = new Date().toISOString();
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', now);
    setConsentData({ status: 'accepted', date: now });
  };

  const declineCookies = () => {
    const now = new Date().toISOString();
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', now);
    setConsentData({ status: 'declined', date: now });
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    setConsentData({ status: null, date: null });
  };

  const hasConsented = consentData.status === 'accepted';
  const hasDeclined = consentData.status === 'declined';
  const needsConsent = consentData.status === null;

  return {
    consentData,
    hasConsented,
    hasDeclined,
    needsConsent,
    acceptCookies,
    declineCookies,
    resetConsent
  };
} 