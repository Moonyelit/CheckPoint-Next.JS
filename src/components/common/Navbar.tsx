import Logo from "@/components/common/Logo";
import BurgerMenu from "@/components/common/BurgerMenu";

import Link from "next/link";
import styles from "./styles/Navbar.module.css";
import '../../styles/globals.css'; 

export default function Navbar() {
  return (
    <nav className={styles["main-navbar"]}>
      {/* Partie gauche : logo + liens de navigation */}
      <div className={styles["left-navigation"]}>
        <Logo />
      </div>

      {/* Partie droite sur écran desktop */}
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

      {/* Le Burger Menu s'affiche uniquement sous 950px */}
      <BurgerMenu />
    </nav>
  );
}