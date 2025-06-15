"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurrentUser, isEmailVerified, updateEmailVerificationStatus } from '@/utils/auth';
import '../styles/Step3.scss';

interface Step3Props {
  email?: string;
  pseudo?: string;
  onEmailVerified?: () => void;
}

const Step3 = ({ email, pseudo, onEmailVerified }: Step3Props) => {
  // Marquer qu'on est à l'étape 3
  useEffect(() => {
    localStorage.setItem('inscriptionStep', '3');
  }, []);
  
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Vérifier si l'email a été vérifié avec succès
    if (searchParams?.get('verified') === 'true') {
      setResendMessage('Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.');
      // Mettre à jour le statut de vérification et passer à l'étape suivante
      const currentUser = getCurrentUser();
      if (currentUser) {
        updateEmailVerificationStatus(true);
        onEmailVerified?.();
      }
    }
    
    // Vérifier s'il y a une erreur de vérification
    if (searchParams?.get('error')) {
      const error = searchParams.get('error');
      if (error === 'token-invalid') {
        setResendMessage('Le lien de vérification est invalide ou a expiré.');
      } else if (error === 'verification-failed') {
        setResendMessage('Erreur lors de la vérification. Veuillez réessayer.');
      }
    }

    // Vérifier périodiquement le statut de vérification
    const checkVerificationStatus = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData.emailVerified) {
              updateEmailVerificationStatus(true);
              onEmailVerified?.();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut:', error);
        }
      }
    };

    // Vérifier immédiatement
    checkVerificationStatus();
    
    // Vérifier toutes les 2 secondes
    const interval = setInterval(checkVerificationStatus, 2000);
    
    return () => clearInterval(interval);
  }, [searchParams, onEmailVerified]);

  const handleContinueClick = () => {
    // Vérifier si l'email a été vérifié
    const emailVerified = isEmailVerified();
    const currentUser = getCurrentUser();
    
    if (emailVerified || (currentUser && currentUser.emailVerified)) {
      // Email vérifié, passer à l'étape 4
      onEmailVerified?.();
    } else {
      // Email non vérifié, afficher la popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('Aucune adresse email trouvée. Veuillez vous réinscrire.');
      return;
    }

    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pseudo: pseudo
        }),
      });

      if (response.ok) {
        setResendMessage('Email de vérification renvoyé avec succès ! Vérifiez votre boîte de réception.');
      } else {
        const errorData = await response.json();
        setResendMessage(`Erreur: ${errorData.error || 'Impossible de renvoyer l&apos;email'}`);
      }
    } catch (error) {
      console.error('Erreur lors du renvoi de l&apos;email:', error);
      setResendMessage('Erreur lors du renvoi de l&apos;email. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="step3__form-container">
      <header className="step3__header">
        <h1 className="step3__title">Bienvenue sur CheckPoint</h1>
        <p className="step3__subtitle">Vous devez vérifier votre email</p>
      </header>

      <div className="step3__section">
        {getCurrentUser() ? (
          // Utilisateur connecté mais email non vérifié
          <div>
                         <p>Votre compte a été créé avec succès, mais vous devez vérifier votre adresse e-mail pour l&apos;activer complètement.</p>
            <p>Un e-mail contenant un lien de vérification vous a été envoyé.</p>
          </div>
        ) : (
          // Utilisateur en cours d'inscription
          <p>Vous devez vérifier votre adresse e-mail pour activer votre compte. Un e-mail contenant un lien pour vérifier votre adresse e-mail vous a été envoyé.</p>
        )}
        
        {email && (
          <div className="step3__email-info">
            <p><strong>Email:</strong> {email}</p>
          </div>
        )}

        <div className="step3__resend-section">
          <p>Vous n&apos;avez pas reçu d&apos;e-mail de notre part ?</p>
          <button 
            onClick={handleResendEmail}
            disabled={isResending}
            className="step3__resend-button"
          >
            {isResending ? 'Envoi en cours...' : 'Renvoyer un e-mail'}
          </button>
        </div>

        {resendMessage && (
          <div 
            className={`step3__message ${resendMessage.includes('succès') || resendMessage.includes('vérifié') ? 'success' : 'error'}`}
            role="alert"
            aria-live="polite"
            aria-label={resendMessage.includes('succès') || resendMessage.includes('vérifié') ? 'Message de succès' : 'Message d\'erreur'}
          >
            {resendMessage}
          </div>
        )}
      </div>

      {/* Popup de validation */}
      {showPopup && (
        <div className="step3__popup-overlay">
          <div className="step3__popup">
            <div className="step3__popup-icon">⚠️</div>
            <h3>Vérification requise</h3>
            <p>Veuillez valider votre adresse e-mail avant de continuer</p>
            <button 
              className="step3__popup-button"
              onClick={() => setShowPopup(false)}
            >
              Compris
            </button>
          </div>
        </div>
      )}

      <button className="btn-custom-inverse" onClick={handleContinueClick}>
        Continuer
      </button>
    </div>
  );
};

export default Step3; 