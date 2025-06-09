"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPendingUser } from '@/utils/emailVerification';
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
  const [userEmail, setUserEmail] = useState(email || '');
  const [userPseudo, setUserPseudo] = useState(pseudo || '');
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Vérifier si l'email a été vérifié avec succès
    if (searchParams?.get('verified') === 'true') {
      setResendMessage('Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.');
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

    // Récupérer les données utilisateur depuis le localStorage si disponibles
    const storedUserData = localStorage.getItem('pendingUser');
    if (storedUserData && !email) {
      const userData = JSON.parse(storedUserData);
      setUserEmail(userData.email);
      setUserPseudo(userData.pseudo);
    }
  }, [searchParams, email]);

  const handleContinueClick = () => {
    // Vérifier si l'email a été vérifié
    const pendingUser = getPendingUser();
    
    if (pendingUser && pendingUser.isVerified) {
      // Email vérifié, passer à l'étape 4
      onEmailVerified?.();
    } else {
      // Email non vérifié, afficher la popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Fermer après 3 secondes
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
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
          email: userEmail,
          pseudo: userPseudo
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
        <p className="step3__subtitle">Vous avez presque terminé</p>
      </header>

      <div className="step3__section">
        <p>Vous devez vérifier votre adresse e-mail pour activer votre compte. Un e-mail contenant un lien pour vérifier votre adresse e-mail vous a été envoyé.</p>
        
        {userEmail && (
          <div className="step3__email-info">
            <p><strong>Email:</strong> {userEmail}</p>
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
          <div className={`step3__message ${resendMessage.includes('succès') || resendMessage.includes('vérifié') ? 'success' : 'error'}`}>
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