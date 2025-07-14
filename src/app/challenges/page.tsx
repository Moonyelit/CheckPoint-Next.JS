import React from "react";
import Image from "next/image";
import "./challenges.scss";

export default function ChallengesPage() {
  return (
    <div className="challenges-page">
      <div className="challenges-content">
        <div className="challenges-content__item">
          <div className="challenges-content__item-crystal">
            <Image src="/images/crystalGIF.gif" alt="Cristal décoratif animé" width={120} height={120} />
          </div>
          <p className="challenges-content__item-message">
            🏆 Préparez-vous pour les défis ! Découvrez des challenges uniques, débloquez des achievements et mesurez-vous aux meilleurs joueurs. Une aventure compétitive vous attend !
          </p>
        </div>
      </div>
    </div>
  );
} 