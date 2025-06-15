"use client";

import { useState, useEffect } from 'react';
import Logo from "@/components/common/Logo";
import BurgerMenu from "@/components/common/BurgerMenu";
import Link from "next/link";
import "./styles/NavBarMain.scss";
import '../../styles/globals.scss';
import { isUserLoggedIn, logout } from '@/utils/auth';
import { useRouter } from 'next/navigation';

//*******************************************************
// Barre de navigation pour les utilisateurs non connectés
//*******************************************************
// Permet à la navigation de se coller en haut de la page lors du scroll
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      {/* Partie gauche : logo */}
      <div className="navbar-left">
        <Logo />
      </div>

      {/* Partie droite : liens et auth */}
      <div className="navbar-right">
        {isAuthenticated ? (
          // Menu pour utilisateur connecté
          <ul className="navbar-right-links">
            <li>
              <Link href="/profile">Mon Profil</Link>
            </li>
            <li>
              <Link href="/games">Jeux</Link>
            </li>
            <li>
              <Link href="/lists">Listes</Link>
            </li>
            <li>
              <Link href="/challenges">Challenges</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-right-auth-link">
                Déconnexion
              </button>
            </li>
          </ul>
        ) : (
          // Menu pour utilisateur non connecté
          <>
            <ul className="navbar-right-links">
              <li>
                <Link href="/" className="navbar-right-links-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/games">Jeux</Link>
              </li>
              <li>
                <Link href="/lists">Listes</Link>
              </li>
              <li>
                <Link href="/challenges">Challenges</Link>
              </li>
            </ul>
            <div className="navbar-right-auth">
              <i className="bx bx-search navbar-right-auth-search"></i>
              <Link href="/inscription" className="navbar-right-auth-link">
                S&apos;inscrire
              </Link>
              <Link href="/connexion" className="navbar-right-auth-link">
                Connexion
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Burger Menu pour les petits écrans */}
      <BurgerMenu />
    </nav>
  );
}
