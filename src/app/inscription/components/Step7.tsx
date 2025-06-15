"use client";
import React from "react";
import '../styles/Step7.scss';


interface Step7Props {
  onContinue?: () => void;
}

const Step7 = ({ onContinue }: Step7Props) => {
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
          onClick={onContinue || (() => { window.location.href = "/"; })}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default Step7; 