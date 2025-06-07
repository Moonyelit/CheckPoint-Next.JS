"use client";
import React from 'react';
import Link from 'next/link';
import styles from './styles/AuthHeader.module.scss';

const AuthHeader = () => {
  return (
    <header className={styles.authHeader}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/images/Logo/Crystal.png" alt="CheckPoint Logo" />
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader; 