"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentUser, updateEmailVerificationStatus, isEmailVerified } from '@/utils/auth';
import '../styles/Step4.scss';

const Step4 = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        // Vérifier d'abord les paramètres URL
        const email = searchParams?.get('email');
        const verified = searchParams?.get('verified');
        const error = searchParams?.get('error');

        if (verified === 'true') {
          setVerificationStatus('success');
          if (email) {
            const emailDecoded = decodeURIComponent(email);
            updateEmailVerificationStatus(true);
          }
          return;
        }

        if (error) {
          setVerificationStatus('error');
          return;
        }

        // Si pas de paramètres URL, vérifier l'état actuel
        const currentUser = getCurrentUser();
        if (currentUser) {
          // Vérifier avec l'API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData.emailVerified) {
              setVerificationStatus('success');
              updateEmailVerificationStatus(true);
              return;
            }
          }
        }

        // Si on arrive ici, on vérifie une dernière fois avec isEmailVerified
        if (isEmailVerified()) {
          setVerificationStatus('success');
          return;
        }

        // Si rien n'est vérifié, on reste en loading
        setVerificationStatus('loading');
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        setVerificationStatus('error');
      }
    };

    // Vérifier immédiatement
    checkVerificationStatus();

    // Vérifier toutes les 2 secondes
    const interval = setInterval(checkVerificationStatus, 2000);

    return () => clearInterval(interval);
  }, [searchParams]);

  const handleContinue = () => {
    // Marquer qu'on passe à l'étape 5
    localStorage.setItem('inscriptionStep', '5');
    
    // Rediriger vers la page d'inscription qui affichera Step5
    window.location.href = '/inscription';
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="step4__form-container">
            <header className="step4__header">
              <div className="step4__achievement-label">
                Vous avez débloqué une quête :
                <br/>
                Réalisation du tutoriel
            </div>
              <h1 className="step4__title">
                Appuyer sur [start] pour jouer
              </h1>
              <p className="step4__description">
                Je sais, je sais, nous préférerions tous sauter le tutoriel et plonger directement dans 
                l&apos;action, mais avant de vous lancer dans votre quête, nous aimerions apprendre à vous 
                connaître pour personnaliser votre compte !<br/>
                Cela ne prendra pas longtemps, c&apos;est promis !
              </p>
            </header>
              <button 
              className="btn-custom-inverse step4__continue-button" 
                onClick={handleContinue}
              aria-label="Continuer vers la personnalisation de l'avatar"
            >
              Continuer
                </button>
          </div>
        );

      case 'error':
        return (
          <div className="step4__form-container">
            <header className="step4__header">
              <div className="step4__achievement-label">
                Erreur de vérification
              </div>
              <h1 className="step4__title_error">
                Oups ! Quelque chose s&apos;est mal passé
              </h1>
              <p className="step4__description">
                Désolé, nous n&apos;avons pas pu vérifier votre adresse e-mail. 
                Le lien peut avoir expiré ou être invalide.
              </p>
            </header>
            <div className="step4__error-actions">
              <button 
                className="btn-custom-inverse"
                onClick={() => window.location.href = '/inscription'}
              >
                Retour à l&apos;inscription
              </button>
              <button 
                className="step4__secondary-button" 
                onClick={() => window.location.href = '/connexion'}
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        );

      case 'loading':
      default:
        return (
          <div className="step4__form-container">
            <header className="step4__header">
              <div className="step4__achievement-label">
                Vérification en cours...
            </div>
              <h1 className="step4__title">
                Chargement de votre profil
              </h1>
              <p className="step4__description">
                Vérification de votre e-mail en cours...
              </p>
            </header>
            <div className="step4__loading-spinner"></div>
          </div>
        );
    }
  };

  return (
    <div className="step4">
        {renderContent()}
    </div>
  );
};

export default Step4; 