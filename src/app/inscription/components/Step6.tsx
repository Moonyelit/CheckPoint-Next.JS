"use client";
import React from "react";
import { safeLocalStorageSet } from "@/utils/auth";
import "../styles/Step6.scss";

interface Step6Props {
  onNext: () => void;
}

const Step6 = ({ onNext }: Step6Props) => {
  // Marquer qu'on est à l'étape 6
  React.useEffect(() => {
    safeLocalStorageSet("inscriptionStep", "6");
  }, []);

  const handleContinue = () => {
    // Marquer qu'on passe à l'étape 7
    safeLocalStorageSet("inscriptionStep", "7");
    onNext();
  };

  return (
    <div className="step6">
      <div className="step6__form-container">
        <header className="step6__header">
          <div className="step6__quest-label">
            Quête du tutoriel (2 sur 3)
          </div>
          <h1 className="step6__title">Zone de départ</h1>
          <p className="step6__description">
            Vous avez sélectionné l&apos;apparence de votre avatar, mais qu&apos;en est-il
            de l&apos;univers qui vous entoure ? Sélectionnez vos univers de jeu
            préféré pour que ce style soit reflété sur votre profil.
          </p>
        </header>

        <div className="step6__content">
          <p className="step6__placeholder">
            Contenu de sélection d&apos;univers à venir...
          </p>
        </div>

        <div className="step6__actions">
          <button 
            className="btn-custom-inverse step6__continue-button" 
            onClick={handleContinue}
            aria-label="Continuer vers l'étape suivante"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;
