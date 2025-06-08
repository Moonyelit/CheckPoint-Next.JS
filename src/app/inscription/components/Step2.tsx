"use client";
import React from 'react';
import '../styles/Step2.scss';

const Step2 = () => {
  return (
    <div className="step2__form-container">
      <header className="step2__header">
        <h1 className="step2__title">Avatar créé avec succès !</h1>
      </header>
      <button className="btn-custom-inverse">Continuer</button>
    </div>
  );
};

export default Step2; 