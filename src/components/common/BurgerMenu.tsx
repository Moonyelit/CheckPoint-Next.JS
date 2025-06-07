"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./styles/BurgerMenu.scss";

//*******************************************************
// Burger Menu pour les petits écrans
//*******************************************************
// Composant qui gère deux menus déroulants séparés :
// 1. Menu de navigation (liens principaux)
// 2. Menu d'authentification (connexion/inscription)
const BurgerMenu: React.FC = () => {
  //*******************************************************
  // ÉTATS DE GESTION DES MENUS
  //*******************************************************
  
  // États pour le menu de navigation principal
  const [navMenuOpen, setNavMenuOpen] = useState(false); // Menu ouvert ou fermé
  const [navMenuClosing, setNavMenuClosing] = useState(false); // Animation de fermeture en cours
  
  // États pour le menu d'authentification  
  const [authMenuOpen, setAuthMenuOpen] = useState(false); // Menu auth ouvert ou fermé
  const [authMenuClosing, setAuthMenuClosing] = useState(false); // Animation de fermeture en cours

  // Durée des animations d'ouverture/fermeture (doit correspondre au CSS)
  const animationDuration = 400; // durée en ms (0.4s)

  //*******************************************************
  // FONCTIONS DE GESTION DU MENU NAVIGATION
  //*******************************************************
  
  // Ouvrir le menu de navigation (ferme le menu auth s'il est ouvert)
  const openNavMenu = () => {
    if (authMenuOpen) closeAuthMenu(); // Ferme l'autre menu si ouvert
    setNavMenuOpen(true);
    setNavMenuClosing(false);
  };

  // Fermer le menu de navigation avec animation
  const closeNavMenu = () => {
    setNavMenuClosing(true); // Déclenche l'animation de sortie
    setTimeout(() => {
      setNavMenuOpen(false); // Retire le menu du DOM après l'animation
      setNavMenuClosing(false);
    }, animationDuration);
  };

  // Basculer l'état du menu navigation (ouvrir/fermer)
  const toggleNavMenu = () => {
    if (navMenuOpen && !navMenuClosing) {
      closeNavMenu();
    } else {
      openNavMenu();
    }
  };

  //*******************************************************
  // FONCTIONS DE GESTION DU MENU AUTHENTIFICATION
  //*******************************************************
  
  // Ouvrir le menu d'authentification (ferme le menu nav s'il est ouvert)
  const openAuthMenu = () => {
    if (navMenuOpen) closeNavMenu(); // Ferme l'autre menu si ouvert
    setAuthMenuOpen(true);
    setAuthMenuClosing(false);
  };

  // Fermer le menu d'authentification avec animation
  const closeAuthMenu = () => {
    setAuthMenuClosing(true); // Déclenche l'animation de sortie
    setTimeout(() => {
      setAuthMenuOpen(false); // Retire le menu du DOM après l'animation
      setAuthMenuClosing(false);
    }, animationDuration);
  };

  // Basculer l'état du menu authentification (ouvrir/fermer)
  const toggleAuthMenu = () => {
    if (authMenuOpen && !authMenuClosing) {
      closeAuthMenu();
    } else {
      openAuthMenu();
    }
  };

  //*******************************************************
  // RENDU DU COMPOSANT
  //*******************************************************
  return (
    <div className="menuBurger">
      {/* Groupe d'icônes : recherche, utilisateur, hamburger */}
      <div className="menuBurger-iconGroup">
        {/* Icône de recherche */}
        <i className="bx bx-search" />
        
        {/* Icône utilisateur - ouvre le menu d'authentification */}
        <i className="bx bx-user-circle" onClick={toggleAuthMenu} />
        
        {/* Hamburger menu custom avec animation (3 barres) */}
        <div
          className={`menuBurger-iconGroup-hamburger ${navMenuOpen ? "open" : ""}`}
          onClick={toggleNavMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* OVERLAY DU MENU NAVIGATION */}
      {navMenuOpen && (
        <div
          className={`menuBurger-menuOverlay ${navMenuClosing ? "menuOverlayExit" : ""}`}
          onClick={toggleNavMenu} // Ferme en cliquant sur l'overlay
        >
          {/* Icône croix pour fermer le menu de navigation */}
          <div className="menuBurger-menuOverlay-closeIcon" onClick={toggleNavMenu}>
            <i className="bx bx-x" />
          </div>
          
          {/* Liste des liens de navigation */}
          <ul className="menuBurger-menuOverlay-menuList" onClick={(e) => e.stopPropagation()}>
            <li onClick={toggleNavMenu}>
              <Link href="/" className="home">
                Home
              </Link>
            </li>
            <li onClick={toggleNavMenu}>
              <Link href="/games">Jeux</Link>
            </li>
            <li onClick={toggleNavMenu}>
              <Link href="/lists">Listes</Link>
            </li>
            <li onClick={toggleNavMenu}>
              <Link href="/challenges">Challenges</Link>
            </li>
          </ul>
        </div>
      )}

      {/* OVERLAY DU MENU AUTHENTIFICATION */}
      {authMenuOpen && (
        <div
          className={`menuBurger-authOverlay ${authMenuClosing ? "authOverlayExit" : ""}`}
          onClick={toggleAuthMenu} // Ferme en cliquant sur l'overlay
        >
          {/* Icône croix pour fermer le menu d'authentification */}
          <div className="menuBurger-authOverlay-closeIcon" onClick={toggleAuthMenu}>
            <i className="bx bx-x" />
          </div>
          
          {/* Liste des liens d'authentification */}
          <ul className="menuBurger-authOverlay-authList" onClick={(e) => e.stopPropagation()}>
            <li onClick={toggleAuthMenu}>
              <Link href="/inscription">S&apos;inscrire</Link>
            </li>
            <li onClick={toggleAuthMenu}>
              <Link href="/auth/connexion">Connexion</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
