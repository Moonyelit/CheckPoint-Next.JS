"use client";
import React from 'react';
// Importation du CSS spécifique au bouton
import './styles/Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Cette interface étend React.ButtonHTMLAttributes<HTMLButtonElement>
   * ce qui signifie qu'elle hérite automatiquement de TOUS les attributs HTML
   * d'un élément <button> natif :
   * - onClick, onKeyDown, onFocus, etc. (événements)
   * - disabled, type, id, className, etc. (attributs HTML)
   * - aria-label, aria-describedby, etc. (accessibilité)
   * - style, data-*, etc. (autres attributs)
   * 
   * Cela permet d'utiliser ce composant comme un bouton HTML normal
   * tout en ajoutant nos propriétés personnalisées (label, ariaDescription)
   */
  /**
   * Texte à afficher sur le bouton
   */
  label?: string;
  /**
   * Description pour les lecteurs d'écran
   */
  ariaDescription?: string;
}

export default function Button({ 
  label = "S'inscrire", 
  ariaDescription,
  ...props 
}: ButtonProps) {
  
  return (
    <button 
      className="btn-custom" 
      aria-label={label}
      {...props}
    >
      {label}
      {ariaDescription && (
        <span className="sr-only">
          {ariaDescription}
        </span>
      )}
    </button>
  );
}
