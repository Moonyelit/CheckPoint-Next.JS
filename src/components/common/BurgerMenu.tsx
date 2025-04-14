"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./styles/BurgerMenu.module.css";

const BurgerMenu: React.FC = () => {
  // États pour le menu de navigation
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [navMenuClosing, setNavMenuClosing] = useState(false);
  
  // États pour le menu d'authentification
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [authMenuClosing, setAuthMenuClosing] = useState(false);

  const animationDuration = 400; // durée en ms (0.4s)

  const openNavMenu = () => {
    if (authMenuOpen) closeAuthMenu();
    setNavMenuOpen(true);
    setNavMenuClosing(false);
  };

  const closeNavMenu = () => {
    setNavMenuClosing(true);
    setTimeout(() => {
      setNavMenuOpen(false);
      setNavMenuClosing(false);
    }, animationDuration);
  };

  const toggleNavMenu = () => {
    if (navMenuOpen && !navMenuClosing) {
      closeNavMenu();
    } else {
      openNavMenu();
    }
  };

  const openAuthMenu = () => {
    if (navMenuOpen) closeNavMenu();
    setAuthMenuOpen(true);
    setAuthMenuClosing(false);
  };

  const closeAuthMenu = () => {
    setAuthMenuClosing(true);
    setTimeout(() => {
      setAuthMenuOpen(false);
      setAuthMenuClosing(false);
    }, animationDuration);
  };

  const toggleAuthMenu = () => {
    if (authMenuOpen && !authMenuClosing) {
      closeAuthMenu();
    } else {
      openAuthMenu();
    }
  };

  return (
    <div className={styles.burgerContainer}>
      <div className={styles.iconGroup}>
        <i className="bx bx-search" />
        <i className="bx bx-user-circle" onClick={toggleAuthMenu} />
        <i className="bx bx-menu" onClick={toggleNavMenu} />
      </div>

      {navMenuOpen && (
        <div
          className={`${styles.menuOverlay} ${navMenuClosing ? styles.menuOverlayExit : ""}`}
          onClick={toggleNavMenu}
        >
          {/* Icône croix pour fermer le menu de navigation */}
          <div className={styles.closeIcon} onClick={toggleNavMenu}>
            <i className="bx bx-x" />
          </div>
          <ul className={styles.menuList} onClick={(e) => e.stopPropagation()}>
            <li onClick={toggleNavMenu}>
              <Link href="/" className={styles.home}>
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

      {authMenuOpen && (
        <div
          className={`${styles.authOverlay} ${authMenuClosing ? styles.authOverlayExit : ""}`}
          onClick={toggleAuthMenu}
        >
          {/* Icône croix pour fermer le menu d'authentification */}
          <div className={styles.closeIcon} onClick={toggleAuthMenu}>
            <i className="bx bx-x" />
          </div>
          <ul className={styles.authList} onClick={(e) => e.stopPropagation()}>
            <li onClick={toggleAuthMenu}>
              <Link href="/inscription">S’inscrire</Link>
            </li>
            <li onClick={toggleAuthMenu}>
              <Link href="/login">Connexion</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
