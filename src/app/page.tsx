import React from 'react';
import '../styles/globals.css'; // Chemin corrigé vers le fichier CSS
import Navbar from '@/components/common/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <p>hello world</p>
    </>
  );
}
