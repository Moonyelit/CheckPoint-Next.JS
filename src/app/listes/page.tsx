import React from "react";
import Image from "next/image";
import "./listes.scss";

export default function ListesPage() {
  return (
    <div className="listes-page">
      <div className="listes-content">
        <div className="listes-content__item">
          <div className="listes-content__item-crystal">
            <Image src="/images/crystalGIF.gif" alt="Cristal décoratif animé" width={120} height={120} />
          </div>
          <p className="listes-content__item-message">
            📋 La section listes arrive bientôt ! Créez vos listes personnalisées, partagez vos collections de jeux préférés et découvrez les listes de la communauté. Une expérience organisée vous attend !
          </p>
        </div>
      </div>
    </div>
  );
} 