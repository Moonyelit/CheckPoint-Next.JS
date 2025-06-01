// src/app/home/noLogin/GameCard.tsx
"use client";
import React from "react";
import "./GameCard.scss";
import Image from 'next/image';

export interface GameCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  alt: string;
}

export default function GameCard({ title, subtitle, imageUrl, alt }: GameCardProps) {
  return (
    <div className="game-card">
      <div className="game-card-image">
        <Image
          src={imageUrl}
          alt={alt}
          width={300}
          height={600}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="game-card-info">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
