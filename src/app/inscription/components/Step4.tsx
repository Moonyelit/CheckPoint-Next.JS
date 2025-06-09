"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearPendingUser, markEmailAsVerified } from '@/utils/emailVerification';
import '../styles/Step3.scss';

const Step4 = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userEmail, setUserEmail] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Marquer qu'on est à l'étape 4
    localStorage.setItem('inscriptionStep', '4');
    
    // Récupérer l'email depuis les paramètres URL
    const email = searchParams?.get('email');
    const verified = searchParams?.get('verified');
    const error = searchParams?.get('error');

    if (email) {
      setUserEmail(decodeURIComponent(email));
    }

    if (verified === 'true') {
      setVerificationStatus('success');
      if (email) {
        markEmailAsVerified(decodeURIComponent(email));
      }
    } else if (error) {
      setVerificationStatus('error');
    }
  }, [searchParams]);

  const handleContinue = () => {
    // Nettoyer les données en attente et les indicateurs d'étape
    clearPendingUser();
    localStorage.removeItem('inscriptionStep');
    window.location.href = '/connexion';
  };

  return (
    <div className="step3__form-container">
      <header className="step3__header">
        {verificationStatus === 'success' && (
          <>
            <h1 className="step3__title">🎉 Félicitations !</h1>
            <p className="step3__subtitle">Votre compte est maintenant activé</p>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <h1 className="step3__title">⚠️ Erreur</h1>
            <p className="step3__subtitle">Problème de vérification</p>
          </>
        )}
        {verificationStatus === 'loading' && (
          <>
            <h1 className="step3__title">⏳ Vérification...</h1>
            <p className="step3__subtitle">Validation en cours</p>
          </>
        )}
      </header>

      <div className="step3__section">
        {verificationStatus === 'success' && (
          <>
            <div className="step3__success-icon">
              <div className="success-checkmark">✓</div>
            </div>
            <p>
              Parfait ! Votre adresse e-mail <strong>{userEmail}</strong> a été vérifiée avec succès.
            </p>
            <p>
              Votre compte CheckPoint est maintenant actif et vous pouvez commencer à sauvegarder votre progression gaming !
            </p>
            <div className="step3__benefits">
              <div className="benefit-item">
                <span className="benefit-icon">🎮</span>
                <span>Sauvegarde de vos parties</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🏆</span>
                <span>Suivi de vos succès</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📈</span>
                <span>Statistiques détaillées</span>
              </div>
            </div>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <p>
              Désolé, nous n&apos;avons pas pu vérifier votre adresse e-mail. 
              Le lien peut avoir expiré ou être invalide.
            </p>
            <p>
              Veuillez réessayer de vous inscrire ou contacter le support si le problème persiste.
            </p>
            <button 
              className="step3__resend-button"
              onClick={() => window.location.href = '/inscription'}
            >
              Retour à l&apos;inscription
            </button>
          </>
        )}

        {verificationStatus === 'loading' && (
          <div className="step3__loading">
            <div className="loading-spinner"></div>
            <p>Vérification de votre e-mail en cours...</p>
          </div>
        )}
      </div>

      {verificationStatus === 'success' && (
        <button className="btn-custom-inverse" onClick={handleContinue}>
          Se connecter maintenant
        </button>
      )}

      {verificationStatus === 'error' && (
        <button className="btn-custom-inverse" onClick={() => window.location.href = '/connexion'}>
          Retour à la connexion
        </button>
      )}
    </div>
  );
};

export default Step4; 