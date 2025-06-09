"use client";

import Link from "next/link";
import "./styles/NavBarInscription.scss";
import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//*******************************************************
// Navbar pour la page d'inscription et d'authentification  
//*******************************************************
// Utilisée sur les pages d'inscription et de connexion
// pour un design minimaliste focalisé sur l'authentification

export default function InscriptionNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    // TODO: Remplacer par votre logique d'authentification
    // Par exemple, vérifier un token dans localStorage, un context, etc.
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      setIsUserLoggedIn(!!(token && user));
    };

    checkAuthStatus();
    
    // Écouter les changements dans localStorage
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  // Déterminer l'état actuel pour le bouton
  const getButtonConfig = () => {
    // Si l'utilisateur est connecté
    if (isUserLoggedIn) {
      return {
        label: "SE DÉCONNECTER",
        action: () => {
          // Logique de déconnexion
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('pendingUser');
          setIsUserLoggedIn(false);
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
      // Récupérer l'étape actuelle depuis localStorage
      const currentStep = typeof window !== 'undefined' ? localStorage.getItem('inscriptionStep') : null;
      
      // Étape 4 : Email vérifié avec succès (considéré comme connecté)
      if (searchParams?.get('verified') === 'true' || currentStep === '4') {
        return {
          label: "SE DÉCONNECTER",
          action: () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('pendingUser');
            localStorage.removeItem('inscriptionStep');
            setIsUserLoggedIn(false);
            router.push('/');
          }
        };
      }

      // Étapes 2 et 3 : Après inscription, pendant la vérification
      if (currentStep === '2' || currentStep === '3') {
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