"use client";
import React, { useEffect, useState } from 'react';
import HeroBanner from './home/noLogin/components/HeroBanner';
import FollowCollection from './home/noLogin/components/FollowCollection';
import FollowTrophy from './home/noLogin/components/FollowTrophy';
import NewFunctionality from './home/noLogin/components/NewFunctionality';
import { isUserLoggedIn } from '@/utils/auth';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const isLoggedIn = isUserLoggedIn();
      setIsConnected(isLoggedIn);
    };

    // Vérifier immédiatement
    checkConnection();
    
    // Écouter les changements de stockage
    window.addEventListener('storage', checkConnection);
    
    // Vérifier périodiquement
    const interval = setInterval(checkConnection, 2000);
    
    return () => {
      window.removeEventListener('storage', checkConnection);
      clearInterval(interval);
    };
  }, []);

  if (isConnected) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>Vous êtes déjà connecté</p>
      </main>
    );
  }

  return (
    <main>
      <HeroBanner />
      <FollowCollection />
      <FollowTrophy />
      <NewFunctionality />
    </main>
  );
}