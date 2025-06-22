"use client";
import React, { useEffect, useState, Suspense } from 'react';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { isUserLoggedIn, getAuthToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

// Lazy loading des composants
const HeroBanner = React.lazy(() => import('./home/noLogin/components/HeroBanner'));
const FollowCollection = React.lazy(() => import('./home/noLogin/components/FollowCollection'));
const FollowTrophy = React.lazy(() => import('./home/noLogin/components/FollowTrophy'));
const NewFunctionality = React.lazy(() => import('./home/noLogin/components/NewFunctionality'));

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isChecking) return; // Évite les vérifications multiples simultanées
      
      setIsChecking(true);
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
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut du tutoriel:', error);
          setIsConnected(false);
          setIsLoading(false);
        }
      } else {
        setIsConnected(false);
        setIsLoading(false);
      }
      setIsChecking(false);
    };

    checkUserStatus();
    
    // Écouter les changements de stockage (une seule fois)
    const handleStorageChange = () => {
      if (!isChecking) {
        checkUserStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, isChecking]);

  if (isLoading) {
    return (
      <main>
        <LoadingSkeleton type="hero-banner" />
        <LoadingSkeleton type="game-card" count={3} />
        <LoadingSkeleton type="game-card" count={3} />
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
      <Suspense fallback={<LoadingSkeleton type="hero-banner" />}>
        <HeroBanner />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton type="game-card" count={3} />}>
        <FollowCollection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton type="game-card" count={3} />}>
        <FollowTrophy />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton type="game-card" count={2} />}>
        <NewFunctionality />
      </Suspense>
    </main>
  );
}