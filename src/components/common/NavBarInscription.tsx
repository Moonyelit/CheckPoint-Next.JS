"use client";

import Link from "next/link";
import "./styles/NavBarInscription.scss";
import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isUserLoggedIn, logout, getCurrentInscriptionStep } from "@/utils/auth";

//*******************************************************
// Navbar pour la page d'inscription et d'authentification  
//*******************************************************
// Utilisée sur les pages d'inscription et de connexion
// pour un design minimaliste focalisé sur l'authentification

export default function InscriptionNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification simple de l'état d'auth
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(isUserLoggedIn());
    };

    checkAuth();
    
    // Écouter les changements de stockage pour la synchronisation
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Déterminer l'état actuel pour le bouton
  const getButtonConfig = () => {
    // Si l'utilisateur est connecté
    if (isAuthenticated) {
      return {
        label: "SE DÉCONNECTER",
        action: () => {
          logout();
          setIsAuthenticated(false); // Mise à jour immédiate
          router.push('/');
        }
      };
    }

    // Si on est sur la page de connexion
    if (pathname === '/connexion') {
      return {
        label: "S'INSCRIRE",
        action: () => router.push('/inscription')
      };
    }

    // Si on est sur la page d'inscription, détecter l'étape
    if (pathname === '/inscription') {
      const currentStep = getCurrentInscriptionStep();
      
      // Étapes 2, 3 et 4 : Processus d'inscription en cours
      if (currentStep === '2' || currentStep === '3' || currentStep === '4') {
        return {
          label: "SE CONNECTER",
          action: () => router.push('/connexion')
        };
      }

      // Étape 1 : Première visite sur l'inscription (ou par défaut)
      return {
        label: "SE CONNECTER",
        action: () => router.push('/connexion')
      };
    }

    // Par défaut, page d'inscription normale
    return {
      label: "S'ENREGISTRER",
      action: () => router.push('/inscription')
    };
  };

  const buttonConfig = getButtonConfig();
  
  return (
    <nav className="inscription-navbar">
      <div className="inscription-navbar__left">
        <Logo />
      </div>
      
      <div className="inscription-navbar__right">
        <Button 
          className="btn-custom-inscription" 
          label={buttonConfig.label}
          onClick={buttonConfig.action}
        />
        <Link href="/" className="inscription-navbar__right__back-link">
          ← Retour
        </Link>
      </div>
    </nav>
  );
} 