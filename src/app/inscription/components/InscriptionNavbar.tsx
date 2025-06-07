"use client";

import Link from "next/link";
import styles from "../styles/InscriptionNavbar.module.scss";

export default function InscriptionNavbar() {
  return (
    <nav className={styles.inscriptionNavbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>CheckPoint</span>
        </Link>
      </div>
      
      <div className={styles.navbarRight}>
        <span className={styles.stepIndicator}>REGISTER</span>
        <Link href="/" className={styles.backLink}>
          ← Retour
        </Link>
      </div>
    </nav>
  );
} 