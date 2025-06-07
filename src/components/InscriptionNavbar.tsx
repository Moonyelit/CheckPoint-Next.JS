"use client";

import Link from "next/link";
import "@/styles/inscription.scss";

export default function InscriptionNavbar() {
  return (
    <nav className="inscription-navbar">
      <div className="inscription-navbar__left">
        <Link href="/" className="inscription-navbar__logo-link">
          <div className="inscription-navbar__logo-icon"></div>
          <span className="inscription-navbar__logo-text">CheckPoint</span>
        </Link>
      </div>
      
      <div className="inscription-navbar__right">
        <span className="inscription-navbar__step-indicator">REGISTER</span>
        <Link href="/" className="inscription-navbar__back-link">
          ← Retour
        </Link>
      </div>
    </nav>
  );
} 