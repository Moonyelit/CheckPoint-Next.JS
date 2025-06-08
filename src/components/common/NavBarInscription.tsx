"use client";

import Link from "next/link";
import "./styles/NavBarInscription.scss";
import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

//*******************************************************
// Navbar pour la page d'inscription et d'authentification  
//*******************************************************
// Utilisée uniquement sur la page d'inscription
// pour un design minimaliste focalisé sur l'inscription

export default function InscriptionNavbar() {
  const router = useRouter();
  return (
    <nav className="inscription-navbar">
      <div className="inscription-navbar__left">
        <Logo />
      </div>
      
      <div className="inscription-navbar__right">
        <Button className="btn-custom-inscription" label="S&apos;ENREGISTRER"
        onClick={() => router.push('/inscription')}
        />
        <Link href="/" className="inscription-navbar__right__back-link">
          ← Retour
        </Link>
      </div>
    </nav>
  );
} 