// src/app/home/noLogin/GameCard.tsx
"use client";
import React from "react";
import "./GameCard.css";

export interface GameCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
}

export default function GameCard({ title, subtitle, imageUrl, alt }: GameCardProps) {
  return (
    <div className="game-card">
      <img src={imageUrl} alt={alt} className="game-card-image" />
      <div className="game-card-info">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
