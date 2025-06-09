"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasUnverifiedEmail } from '@/utils/emailVerification';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const EmailVerificationGuard = ({ 
  children, 
  redirectTo = '/inscription/step3' 
}: EmailVerificationGuardProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkEmailVerification = () => {
      if (hasUnverifiedEmail()) {
        setShouldRedirect(true);
      }
      setIsChecking(false);
    };

    // Petite délai pour éviter le flash
    const timer = setTimeout(checkEmailVerification, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldRedirect && !isChecking) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, isChecking, router, redirectTo]);

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white'
      }}>
        Vérification en cours...
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'white'
      }}>
        Redirection vers la vérification d&apos;email...
      </div>
    );
  }

  return <>{children}</>;
};

export default EmailVerificationGuard; 