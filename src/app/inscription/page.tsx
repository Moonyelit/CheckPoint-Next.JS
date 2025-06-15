"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getInitialInscriptionStep } from '@/utils/auth';
import './inscription.scss';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import Step7 from './components/Step7';
import { useRouter } from 'next/navigation';

interface FormData {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOver16: boolean;
  acceptTerms: boolean;
}

export default function Inscription() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    isOver16: false,
    acceptTerms: false
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  // Déterminer l'étape d'inscription avec la fonction centralisée
  useEffect(() => {
    const initializeStep = async () => {
      try {
        const step = await getInitialInscriptionStep(searchParams ?? undefined);
        if (step === 0) {
          // Si le tutoriel est terminé, rediriger vers la page d'accueil
          router.push('/');
        } else {
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'étape:', error);
        setCurrentStep(1);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStep();
  }, [searchParams, router]);
  
  const handleStep1Submit = async (data: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Inscription réussie:', userData);
        setFormData({ ...formData, ...data });
        setCurrentStep(2);
      } else {
        const errorData = await response.json();
        console.error('Erreur de l\'API:', errorData);
        
        // Gestion spécifique des erreurs de validation
        if (response.status === 422 && errorData.violations) {
          const errors = errorData.violations.map((v: { message: string }) => v.message).join(', ');
          alert('Erreur de validation: ' + errors);
        } else if (response.status === 400) {
          alert('Erreur lors de l\'inscription: ' + (errorData.detail || errorData.message || 'Données invalides'));
        } else {
          alert('Erreur lors de l\'inscription: ' + (errorData.detail || errorData.message || 'Erreur inconnue'));
        }
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'inscription:', error);
      alert('Erreur de connexion au serveur. Vérifiez que votre API est démarrée sur http://localhost:8000');
    }
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleEmailVerified = () => {
    setCurrentStep(4);
  };

  const handleStep5Next = () => {
    setCurrentStep(6);
  };

  const handleStep6Next = () => {
    setCurrentStep(7);
  };

  if (isLoading) {
    return (
      <div className="inscription">
        <div className="inscription__loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inscription">
      {currentStep === 1 && (
        <Step1 
          onSubmit={handleStep1Submit}
          initialData={formData}
        />
      )}
      {currentStep === 2 && (
        <Step2 onNext={handleStep2Next} />
      )}
      {currentStep === 3 && (
        <Step3 
          email={formData.email}
          pseudo={formData.pseudo}
          onEmailVerified={handleEmailVerified}
        />
      )}
      {currentStep === 4 && (
        <Step4 />
      )}
      {currentStep === 5 && (
        <Step5 onNext={handleStep5Next} />
      )}
      {currentStep === 6 && (
        <Step6 onNext={handleStep6Next} />
      )}
      {currentStep === 7 && (
        <Step7 />
      )}
    </div>
  );
} 