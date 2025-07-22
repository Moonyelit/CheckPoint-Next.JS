import React from "react";
import "./CritiquesSection1.scss";

export default function CritiquesSection1() {
  return (
    <section className="critiques-section1" aria-label="Section des critiques">
      <div className="critiques-content__item">
        <p className="critiques-content__item-message" role="status" aria-live="polite">
          🎮 La section critiques arrive bientôt ! Partagez votre avis, découvrez les critiques de la communauté et contribuez à l&apos;écosystème gaming. Une expérience interactive vous attend !
        </p>
      </div>
    </section>
  );
}
