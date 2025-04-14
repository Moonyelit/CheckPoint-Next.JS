"use client";
import React from 'react';
import Button from '@/components/common/Button';
import './HeroBanner.css'; 

export default function HeroBanner() {
  return (
    <section className="hero-container">
      {/* Optionnel : on ajoute une overlay pour améliorer la lisibilité */}
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Parce que chaque partie mérite d'être sauvegardée</h1>
          <p>
            La plateforme gamifiée pour suivre ta progression  
            et gérer ta collection de jeux vidéo
          </p>
          <Button label="S'inscrire" />
        </div>
      </div>
    </section>
  );
}
