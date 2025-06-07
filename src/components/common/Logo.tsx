'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import './styles/Logo.scss'
// import Crystals3D from './Crystals3D'  // Commente le crystal 3D pour l'instant

export default function Logo() {
  return (
    <Link href="/" className="logo">
      {/* Utilisation du GIF à la place du modèle 3D */}
      <Image 
        src="/images/crystalGIF.gif" 
        alt="Animation du crystal" 
        width={80} 
        height={80}
        className="logo-crystalGif"
      />
      <div className="logo-checkPoint">
        <span className="logo-checkPoint-check">Check</span>
        <span className="logo-checkPoint-point">Point</span>
      </div>
    </Link>
  )
}
