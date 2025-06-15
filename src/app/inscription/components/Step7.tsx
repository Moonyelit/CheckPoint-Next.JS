"use client";
import React from "react";
import { getAuthToken } from "@/utils/auth";
import '../styles/Step7.scss';


interface Step7Props {
  onContinue?: () => void;
}

const Step7 = ({ onContinue }: Step7Props) => {
  const handleContinue = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token non trouvé');
      }

      // D'abord, récupérer les informations de l'utilisateur
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      const userData = await userResponse.json();

      // Ensuite, faire la mise à jour avec l'ID de l'utilisateur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorialCompleted: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Réponse du serveur:', data);
        throw new Error(data.message || data.detail || 'Erreur lors de la mise à jour du statut du tutoriel');
      }

      if (onContinue) {
        onContinue();
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut du tutoriel: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  return (
    <div className="step7">
      <div className="step7__form-container">
        <header className="step7__header">
          <div className="step7__quest-label">
            Quête du tutoriel (3 sur 3)
          </div>
          <h1 className="step7__title">CheckPoint</h1>
          <p className="step7__description">
            Bravo vous avez fini le tutoriel !<br />
            Vous pouvez commencer à ajouter des jeux à votre collection en parcourant notre immense bibliothèque de jeux ! Maintenant, sortez et explorez par vous-même !
          </p>
        </header>
        <button
          className="btn-custom-inverse step7__continue-button"
          onClick={handleContinue}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default Step7; 