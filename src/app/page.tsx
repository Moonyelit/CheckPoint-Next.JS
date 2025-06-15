"use client";
import React, { useEffect, useState } from 'react';
import HeroBanner from './home/noLogin/components/HeroBanner';
import FollowCollection from './home/noLogin/components/FollowCollection';
import FollowTrophy from './home/noLogin/components/FollowTrophy';
import NewFunctionality from './home/noLogin/components/NewFunctionality';
import { isUserLoggedIn, getAuthToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      const isLoggedIn = isUserLoggedIn();

      if (isLoggedIn) {
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error('Token non trouvé');
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            if (!userData.tutorialCompleted) {
              router.push('/inscription?step=5');
            } else {
              setIsConnected(true);
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut du tutoriel:', error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkUserStatus();
    
    // Écouter les changements de stockage
    window.addEventListener('storage', checkUserStatus);
    
    // Vérifier périodiquement
    const interval = setInterval(checkUserStatus, 2000);
    
    return () => {
      window.removeEventListener('storage', checkUserStatus);
      clearInterval(interval);
    };
  }, [router]);

  if (isLoading) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>Chargement...</p>
      </main>
    );
  }

  if (isConnected) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>Vous êtes connecté</p>
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