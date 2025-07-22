"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./styles/BurgerMenu.scss";
import { isUserLoggedIn, logout } from '@/utils/auth';
import { useRouter } from 'next/navigation';

//*******************************************************
// Burger Menu pour les petits écrans
//*******************************************************
// Composant qui gère deux menus déroulants séparés :
// 1. Menu de navigation (liens principaux)
// 2. Menu d'authentification (connexion/inscription ou profil/déconnexion)
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

  // État d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Références pour la gestion du focus
  const navButtonRef = useRef<HTMLButtonElement>(null);
  const authButtonRef = useRef<HTMLButtonElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const authMenuRef = useRef<HTMLDivElement>(null);

  // Durée des animations d'ouverture/fermeture (doit correspondre au CSS)
  const animationDuration = 400; // durée en ms (0.4s)

  // Vérification de l'état d'authentification
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = isUserLoggedIn();
      setIsAuthenticated(isLoggedIn);
    };

    // Vérifier immédiatement
    checkAuth();
    
    // Écouter les changements de stockage
    window.addEventListener('storage', checkAuth);
    
    // Vérifier périodiquement
    const interval = setInterval(checkAuth, 2000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Gestion de la fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (navMenuOpen) closeNavMenu();
        if (authMenuOpen) closeAuthMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navMenuOpen, authMenuOpen]);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push('/');
    closeAuthMenu();
  };

  //*******************************************************
  // FONCTIONS DE GESTION DU MENU NAVIGATION
  //*******************************************************
  
  // Ouvrir le menu de navigation (ferme le menu auth s'il est ouvert)
  const openNavMenu = () => {
    if (authMenuOpen) closeAuthMenu(); // Ferme l'autre menu si ouvert
    setNavMenuOpen(true);
    setNavMenuClosing(false);
    // Focus sur le premier élément du menu après l'animation
    setTimeout(() => {
      const firstLink = navMenuRef.current?.querySelector('a, button');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }, 100);
  };

  // Fermer le menu de navigation avec animation
  const closeNavMenu = () => {
    setNavMenuClosing(true); // Déclenche l'animation de sortie
    setTimeout(() => {
      setNavMenuOpen(false); // Retire le menu du DOM après l'animation
      setNavMenuClosing(false);
      // Retourner le focus au bouton d'ouverture
      navButtonRef.current?.focus();
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
    // Focus sur le premier élément du menu après l'animation
    setTimeout(() => {
      const firstLink = authMenuRef.current?.querySelector('a, button');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }, 100);
  };

  // Fermer le menu d'authentification avec animation
  const closeAuthMenu = () => {
    setAuthMenuClosing(true); // Déclenche l'animation de sortie
    setTimeout(() => {
      setAuthMenuOpen(false); // Retire le menu du DOM après l'animation
      setAuthMenuClosing(false);
      // Retourner le focus au bouton d'ouverture
      authButtonRef.current?.focus();
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
    <div className="menuBurger" role="navigation" aria-label="Menu mobile">
      {/* Groupe d'icônes : recherche, utilisateur, hamburger */}
      <div className="menuBurger-iconGroup" role="group" aria-label="Actions du menu mobile">
        {/* Icône de recherche */}
        <button 
          className="menuBurger-search-btn"
          aria-label="Rechercher des jeux"
          title="Rechercher des jeux"
        >
          <i className="bx bx-search" aria-hidden="true" />
        </button>
        
        {/* Icône utilisateur - ouvre le menu d'authentification */}
        <button
          ref={authButtonRef}
          className="menuBurger-user-btn"
          onClick={toggleAuthMenu}
          aria-label="Menu utilisateur"
          aria-expanded={authMenuOpen}
          aria-haspopup="true"
          aria-controls="auth-menu"
        >
          <i className="bx bx-user-circle" aria-hidden="true" />
        </button>
        
        {/* Hamburger menu custom avec animation (3 barres) */}
        <button
          ref={navButtonRef}
          className={`menuBurger-iconGroup-hamburger ${navMenuOpen ? "open" : ""}`}
          onClick={toggleNavMenu}
          aria-label="Menu de navigation"
          aria-expanded={navMenuOpen}
          aria-haspopup="true"
          aria-controls="nav-menu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      {/* OVERLAY DU MENU NAVIGATION */}
      {navMenuOpen && (
        <div
          ref={navMenuRef}
          id="nav-menu"
          className={`menuBurger-menuOverlay ${navMenuClosing ? "menuOverlayExit" : ""}`}
          onClick={toggleNavMenu} // Ferme en cliquant sur l'overlay
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          {/* Icône croix pour fermer le menu de navigation */}
          <button 
            className="menuBurger-menuOverlay-closeIcon" 
            onClick={toggleNavMenu}
            aria-label="Fermer le menu de navigation"
          >
            <i className="bx bx-x" aria-hidden="true" />
          </button>
          
          {/* Liste des liens de navigation */}
          <ul 
            className="menuBurger-menuOverlay-menuList" 
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            <li role="none">
              <Link href="/" className="home" role="menuitem" onClick={toggleNavMenu}>
                Home
              </Link>
            </li>
            <li role="none">
              <Link href="/search?query=top100_games" role="menuitem" onClick={toggleNavMenu}>
                Jeux
              </Link>
            </li>
            <li role="none">
              <Link href="/listes" role="menuitem" onClick={toggleNavMenu}>
                Listes
              </Link>
            </li>
            <li role="none">
              <Link href="/challenges" role="menuitem" onClick={toggleNavMenu}>
                Challenges
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* OVERLAY DU MENU AUTHENTIFICATION */}
      {authMenuOpen && (
        <div
          ref={authMenuRef}
          id="auth-menu"
          className={`menuBurger-authOverlay ${authMenuClosing ? "authOverlayExit" : ""}`}
          onClick={toggleAuthMenu} // Ferme en cliquant sur l'overlay
          role="dialog"
          aria-modal="true"
          aria-label="Menu d'authentification"
        >
          {/* Icône croix pour fermer le menu d'authentification */}
          <button 
            className="menuBurger-authOverlay-closeIcon" 
            onClick={toggleAuthMenu}
            aria-label="Fermer le menu d'authentification"
          >
            <i className="bx bx-x" aria-hidden="true" />
          </button>
          
          {/* Liste des liens d'authentification - adaptée selon l'état de connexion */}
          <ul 
            className="menuBurger-authOverlay-authList" 
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            {isAuthenticated ? (
              // Menu pour utilisateur connecté
              <>
                <li role="none">
                  <Link href="/profile" role="menuitem" onClick={toggleAuthMenu}>
                    Mon Profil
                  </Link>
                </li>
                <li role="none">
                  <button 
                    className="menuBurger-logout-btn" 
                    onClick={handleLogout}
                    role="menuitem"
                    aria-label="Se déconnecter de mon compte"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              // Menu pour utilisateur non connecté
              <>
                <li role="none">
                  <Link href="/inscription" role="menuitem" onClick={toggleAuthMenu}>
                    S&apos;inscrire
                  </Link>
                </li>
                <li role="none">
                  <Link href="/connexion" role="menuitem" onClick={toggleAuthMenu}>
                    Connexion
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
