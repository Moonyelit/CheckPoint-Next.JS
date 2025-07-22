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
  /**
   * Indique si le bouton est en cours de chargement
   */
  loading?: boolean;
  /**
   * Indique si le bouton est pressé (pour les boutons toggle)
   */
  pressed?: boolean;
}

export default function Button({ 
  label = "S'inscrire", 
  ariaDescription,
  loading = false,
  pressed = false,
  disabled,
  ...props 
}: ButtonProps) {
  
  // Combiner les classes pour l'état de chargement et pressé
  const buttonClasses = [
    "btn-custom",
    loading ? "btn-custom--loading" : "",
    pressed ? "btn-custom--pressed" : "",
    disabled ? "btn-custom--disabled" : ""
  ].filter(Boolean).join(" ");
  
  return (
    <button 
      className={buttonClasses}
      aria-label={label}
      aria-describedby={ariaDescription ? "button-description" : undefined}
      aria-pressed={pressed}
      aria-busy={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-custom__loading-indicator" aria-hidden="true">
          <span className="btn-custom__spinner"></span>
        </span>
      )}
      <span className="btn-custom__text">
        {label}
      </span>
      {ariaDescription && (
        <span id="button-description" className="sr-only">
          {ariaDescription}
        </span>
      )}
    </button>
  );
}
