"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearPendingUser, markEmailAsVerified } from '@/utils/emailVerification';
import { getCurrentUser, cleanupInscriptionData, updateEmailVerificationStatus } from '@/utils/auth';
import '../styles/Step4.scss';

const Step4 = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
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

    if (verified === 'true') {
      setVerificationStatus('success');
      console.log('🎉 Email vérifié avec succès !');
      
      if (email) {
        console.log('📧 Mise à jour des données pour email:', decodeURIComponent(email));
        markEmailAsVerified(decodeURIComponent(email));
        
        // S'assurer que les données pendingUser sont correctement mises à jour
        const emailDecoded = decodeURIComponent(email);
        const pendingUser = localStorage.getItem('pendingUser');
        
        if (pendingUser) {
          try {
            const userData = JSON.parse(pendingUser);
            if (userData.email === emailDecoded) {
              const updatedUserData = {
                ...userData,
                isVerified: true
              };
              localStorage.setItem('pendingUser', JSON.stringify(updatedUserData));
              console.log('✅ Données pendingUser mises à jour:', updatedUserData);
            }
          } catch (error) {
            console.error('❌ Erreur mise à jour pendingUser:', error);
          }
        } else {
          // Créer des données pendingUser si elles n'existent pas
          const newPendingUser = {
            email: emailDecoded,
            pseudo: emailDecoded.split('@')[0],
            isVerified: true,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('pendingUser', JSON.stringify(newPendingUser));
          console.log('📦 Nouvelles données pendingUser créées:', newPendingUser);
        }
      }
      
      // IMPORTANT: Mettre à jour le statut de l'utilisateur connecté si c'est lui
      if (currentUser && (email === currentUser.email || !email)) {
        console.log('🔄 Mise à jour du statut emailVerified pour l\'utilisateur connecté');
        updateEmailVerificationStatus(true);
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
              aria-label="Continuer vers l'accueil"
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