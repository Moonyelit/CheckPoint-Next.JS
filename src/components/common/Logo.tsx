'use client'
import Link from 'next/link'
import React from 'react'
import styles from './styles/Logo.module.css'
import CrystalEmbed from './CrystalEmbed'

export default function Logo() {
  return (
    <Link href="/" className={styles.logoLink}>
      <CrystalEmbed />
      <div className={styles.textContainer}>
        <span className={styles.checkText}>Check</span>
        <span className={styles.pointText}>Point</span>
      </div>
    </Link>
  )
}
