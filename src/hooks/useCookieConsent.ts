'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Ne vérifier le consentement que côté client
    if (!isClient) return;

    // Vérifier le consentement au chargement
    const checkConsent = () => {
      const status = localStorage.getItem('cookieConsent');
      const date = localStorage.getItem('cookieConsentDate');
      
      setConsentData({
        status: status as 'accepted' | 'declined' | null,
        date
      });
    };

    checkConsent();

    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent' || e.key === 'cookieConsentDate') {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isClient]);

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