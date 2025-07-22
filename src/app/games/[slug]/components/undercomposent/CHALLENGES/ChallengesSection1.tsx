import React from "react";
import "./ChallengesSection1.scss";

export default function ChallengesSection1() {
  return (
    <section className="challenges-section1" aria-label="Section des challenges">
      <div className="challenges-content__item">
        <p className="challenges-content__item-message" role="status" aria-live="polite">
          🏆 Préparez-vous pour les défis ! Découvrez des challenges uniques, débloquez des achievements et mesurez-vous aux meilleurs joueurs. Une aventure compétitive vous attend !
        </p>
      </div>
    </section>
  );
} 