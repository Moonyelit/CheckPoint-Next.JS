"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearPendingUser, markEmailAsVerified } from '@/utils/emailVerification';
import { getCurrentUser, logout, cleanupInscriptionData } from '@/utils/auth';
import '../styles/Step3.scss';
import '../styles/Step4.scss';

const Step4 = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Marquer qu'on est à l'étape 4
    localStorage.setItem('inscriptionStep', '4');
    
    // Récupérer l'email depuis les paramètres URL ou l'utilisateur connecté
    const email = searchParams?.get('email');
    const verified = searchParams?.get('verified');
    const error = searchParams?.get('error');

    // Essayer de récupérer les infos de l'utilisateur connecté
    const currentUser = getCurrentUser();
    
    if (email) {
      setUserEmail(decodeURIComponent(email));
    } else if (currentUser) {
      setUserEmail(currentUser.email);
      setUserName(currentUser.pseudo);
    }

    if (verified === 'true') {
      setVerificationStatus('success');
      if (email) {
        markEmailAsVerified(decodeURIComponent(email));
      }
    } else if (error) {
      setVerificationStatus('error');
    } else if (currentUser && currentUser.emailVerified) {
      // Si l'utilisateur est déjà connecté et vérifié
      setVerificationStatus('success');
    }
  }, [searchParams]);

  const handleContinue = () => {
    // Nettoyer les données en attente et les indicateurs d'étape
    clearPendingUser();
    cleanupInscriptionData();
    
    // Si l'utilisateur est déjà connecté, aller à l'accueil, sinon à la connexion
    const currentUser = getCurrentUser();
    if (currentUser) {
      window.location.href = '/';
    } else {
      window.location.href = '/connexion';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="step4__success-container">
            <div className="step4__celebration-text">
              <h1 className="step3__title">🎉 Félicitations !</h1>
              <p className="step3__subtitle">Votre compte est maintenant activé</p>
            </div>

            <div className="step4__success-icon">
              <div className="success-checkmark">✓</div>
            </div>

            <div className="step3__section">
              <p role="alert" aria-live="polite">
                Parfait ! Votre adresse e-mail <strong>{userEmail}</strong> a été vérifiée avec succès.
              </p>
              {userName && (
                <p aria-label={`Message de bienvenue pour ${userName}`}>
                  Bienvenue <strong>{userName}</strong> ! Votre compte CheckPoint est maintenant actif.
                </p>
              )}
              <p>
                Vous pouvez maintenant commencer à sauvegarder votre progression gaming !
              </p>

              <div className="step4__benefits">
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
            </div>

            <div className="step3_endform">
              <button 
                className="btn-custom-inverse step4__action-button" 
                onClick={handleContinue}
              >
                {getCurrentUser() ? 'Continuer vers l\'accueil' : 'Se connecter maintenant'}
              </button>
              <button 
                className="step3__resend-button" 
                onClick={handleLogout}
                style={{ marginTop: '1rem' }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="step4__error-container">
            <h1 className="step3__title">⚠️ Erreur</h1>
            <p className="step3__subtitle">Problème de vérification</p>

            <div className="step3__section">
              <div className="error-icon" aria-label="Icône d'erreur">❌</div>
              <p role="alert" aria-live="assertive">
                Désolé, nous n&apos;avons pas pu vérifier votre adresse e-mail. 
                Le lien peut avoir expiré ou être invalide.
              </p>
              <p>
                Veuillez réessayer de vous inscrire ou contacter le support si le problème persiste.
              </p>
            </div>

            <div className="step3_endform">
              <button 
                className="step3__resend-button"
                onClick={() => window.location.href = '/inscription'}
              >
                Retour à l&apos;inscription
              </button>
              <button 
                className="btn-custom-inverse" 
                onClick={() => window.location.href = '/connexion'}
                style={{ marginTop: '1rem' }}
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        );

      case 'loading':
      default:
        return (
          <div className="step4__loading-container">
            <h1 className="step3__title">⏳ Vérification...</h1>
            <p className="step3__subtitle">Validation en cours</p>

            <div className="step3__section">
              <div className="loading-spinner"></div>
              <p>Vérification de votre e-mail en cours...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="step3__form-container">
      <header className="step3__header">
        {renderContent()}
      </header>
    </div>
  );
};

export default Step4; 