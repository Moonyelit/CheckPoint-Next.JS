"use client";
import React from 'react';
import { safeLocalStorageSet } from '@/utils/auth';
import '../styles/Step2.scss';

interface Step2Props {
  onNext: () => void;
}

const Step2 = ({ onNext }: Step2Props) => {
  // Marquer qu'on est à l'étape 2
  React.useEffect(() => {
    safeLocalStorageSet('inscriptionStep', '2');
  }, []);

  const handleNext = () => {
    // Marquer qu'on passe à l'étape 3
    safeLocalStorageSet('inscriptionStep', '3');
    onNext();
  };

  return (
    <div className="step2__form-container">
      <header className="step2__header">
        <h1 className="step2__title" role="alert" aria-live="polite">Avatar créé avec succès !</h1>
      </header>
      <button 
        className="btn-custom-inverse" 
        onClick={handleNext}
        aria-label="Continuer vers l'étape suivante"
      >
        Continuer
      </button>
    </div>
  );
};

export default Step2; 