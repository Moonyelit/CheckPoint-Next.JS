"use client";

import { useState, useEffect } from 'react';
import Logo from "@/components/common/Logo";
import BurgerMenu from "@/components/common/BurgerMenu";
import Link from "next/link";
import "./styles/NavBarMain.scss";
import '../../styles/globals.scss';
import { isUserLoggedIn, logout } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import SearchOverlay from "@/components/common/SearchOverlay";

//*******************************************************
// Barre de navigation pour les utilisateurs non connectés
//*******************************************************
// Permet à la navigation de se coller en haut de la page lors du scroll
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

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

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav 
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Navigation principale"
      id="navigation"
    >
      {/* Partie gauche : logo */}
      <div className="navbar-left">
        <Logo />
      </div>

      {/* Partie droite : liens et auth */}
      <div className="navbar-right">
        {isAuthenticated ? (
          // Menu pour utilisateur connecté
          <ul className="navbar-right-links" role="menubar" aria-label="Menu utilisateur connecté">
            <li role="none">
              <Link href="/profile" role="menuitem" aria-label="Accéder à mon profil">
                Mon Profil
              </Link>
            </li>
            <li role="none">
              <Link href="/search?query=top100_games" role="menuitem" aria-label="Voir tous les jeux">
                Jeux
              </Link>
            </li>
            <li role="none">
              <Link href="/listes" role="menuitem" aria-label="Voir mes listes de jeux">
                Listes
              </Link>
            </li>
            <li role="none">
              <Link href="/challenges" role="menuitem" aria-label="Voir les challenges">
                Challenges
              </Link>
            </li>
            <li role="none">
              <button 
                onClick={handleLogout} 
                className="navbar-right-auth-link"
                role="menuitem"
                aria-label="Se déconnecter de mon compte"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        ) : (
          // Menu pour utilisateur non connecté
          <>
            <ul className="navbar-right-links" role="menubar" aria-label="Menu navigation principale">
              <li role="none">
                <Link href="/" className="navbar-right-links-home" role="menuitem" aria-label="Retour à l'accueil">
                  Home
                </Link>
              </li>
              <li role="none">
                <Link href="/search?query=top100_games" role="menuitem" aria-label="Voir tous les jeux">
                  Jeux
                </Link>
              </li>
              <li role="none">
                <Link href="/listes" role="menuitem" aria-label="Voir les listes de jeux">
                  Listes
                </Link>
              </li>
              <li role="none">
                <Link href="/challenges" role="menuitem" aria-label="Voir les challenges">
                  Challenges
                </Link>
              </li>
            </ul>
            <div className="navbar-right-auth" role="group" aria-label="Actions d'authentification">
              <button 
                className="navbar-right-auth-search"
                onClick={() => setShowSearch(true)}
                aria-label="Ouvrir la recherche de jeux"
                aria-expanded={showSearch}
              >
                <i className="bx bx-search" aria-hidden="true"></i>
              </button>
              <Link 
                href="/inscription" 
                className="navbar-right-auth-link"
                aria-label="Créer un compte CheckPoint"
              >
                S&apos;inscrire
              </Link>
              <Link 
                href="/connexion" 
                className="navbar-right-auth-link"
                aria-label="Se connecter à mon compte"
              >
                Connexion
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Burger Menu pour les petits écrans */}
      <BurgerMenu />

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </nav>
  );
}
