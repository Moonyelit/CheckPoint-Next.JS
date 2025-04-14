"use client";
import React from 'react';
// Importation du CSS spécifique au bouton
import './styles/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Texte à afficher sur le bouton
   */
  label?: string;
}

export default function Button({ label = "S'inscrire", ...props }: ButtonProps) {
  return (
    <button className="btn-custom" {...props}>
      {label}
    </button>
  );
}
