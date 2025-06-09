"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './inscription.scss';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';

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
  const [formData, setFormData] = useState<FormData>({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    isOver16: false,
    acceptTerms: false
  });
  const searchParams = useSearchParams();

  // Vérifier s'il y a une redirection depuis la vérification email
  useEffect(() => {
    const verified = searchParams?.get('verified');
    const error = searchParams?.get('error');
    
    if (verified === 'true' || error) {
      setCurrentStep(4);
    }
  }, [searchParams]);
  
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
    </div>
  );
} 