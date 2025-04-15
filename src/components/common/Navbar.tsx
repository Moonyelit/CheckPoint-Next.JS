import { useState, useEffect } from 'react';
import Logo from "@/components/common/Logo";
import BurgerMenu from "@/components/common/BurgerMenu";
import Link from "next/link";
import styles from "./styles/Navbar.module.css";
import '../../styles/globals.css'; 

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Dès qu'on dépasse 10 pixels, la navbar devient sticky
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles["main-navbar"]} ${isSticky ? styles.sticky : ''}`}>
      {/* Partie gauche : logo */}
      <div className={styles["left-navigation"]}>
        <Logo />
      </div>

      {/* Partie droite : liens et auth */}
      <div className={styles["right-navigation"]}>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" className={styles.home}>
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
        <div className={styles["auth-navigation"]}>
          <i className="bx bx-search"></i>
          <Link href="/inscription" className={styles.authLink}>
            S’inscrire
          </Link>
          <Link href="/login" className={styles.authLink}>
            Connexion
          </Link>
        </div>
      </div>

      {/* Burger Menu pour les petits écrans */}
      <BurgerMenu />
    </nav>
  );
}
