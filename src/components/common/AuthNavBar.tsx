"use client";
import React from 'react';
import Link from 'next/link';
import "@/styles/auth-navbar.scss";

//*******************************************************
// Navbar simple pour les pages d'authentification
//*******************************************************
// Utilisée uniquement sur les pages de connexion et inscription
// pour un design minimaliste focalisé sur l'auth
const AuthNavBar = () => {
  return (
    <nav className="auth-navbar">
      <div className="auth-navbar__container">
        <div className="auth-navbar__left">
          <Link href="/" className="auth-navbar__logo-link">
            <div className="auth-navbar__logo-icon"></div>
            <span className="auth-navbar__logo-text">CheckPoint</span>
          </Link>
        </div>
        
        <div className="auth-navbar__right">
          <Link href="/" className="auth-navbar__back-link">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavBar; 