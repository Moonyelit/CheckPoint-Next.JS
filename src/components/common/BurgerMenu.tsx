"use client";

// components/BurgerMenu.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles/BurgerMenu.module.css";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Fermer le menu si la fenêtre est redimensionnée au-delà de 950px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 950) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Icône burger */}
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        <div className={isOpen ? `${styles.line} ${styles.line1Open}` : styles.line}></div>
        <div className={isOpen ? `${styles.line} ${styles.line2Open}` : styles.line}></div>
        <div className={isOpen ? `${styles.line} ${styles.line3Open}` : styles.line}></div>
      </div>

      {/* Menu overlay regroupant les liens et la partie auth */}
      <div className={isOpen ? `${styles.menuOverlay} ${styles.menuOpen}` : styles.menuOverlay}>
        <nav className={styles.menuNav}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/games" onClick={() => setIsOpen(false)}>Jeux</Link>
            </li>
            <li>
              <Link href="/lists" onClick={() => setIsOpen(false)}>Listes</Link>
            </li>
            <li>
              <Link href="/challenges" onClick={() => setIsOpen(false)}>Challenges</Link>
            </li>
          </ul>
          <div className={styles.authNavigation}>
            <i className="bx bx-search"></i>
            <Link href="/inscription" onClick={() => setIsOpen(false)} className={styles.authLink}>
              S’inscrire
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className={styles.authLink}>
              Connexion
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}