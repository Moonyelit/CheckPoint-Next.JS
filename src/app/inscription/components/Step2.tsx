"use client";
import React from 'react';
import '../styles/Step2.scss';

interface Step2Props {
  onNext: () => void;
}

const Step2 = ({ onNext }: Step2Props) => {
  return (
    <div className="step2__form-container">
      <header className="step2__header">
        <h1 className="step2__title">Avatar créé avec succès !</h1>
      </header>
      <button className="btn-custom-inverse" onClick={onNext}>
        Continuer
      </button>
    </div>
  );
};

export default Step2; 