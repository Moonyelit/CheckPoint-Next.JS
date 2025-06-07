"use client";
import React, { useState } from 'react';
import './inscription.scss';
import Step1 from './components/Step1';

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

  const handleStep1Submit = async (data: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        alert('Erreur lors de l\'inscription: ' + (errorData.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'inscription:', error);
      alert('Erreur de connexion au serveur. Vérifiez que votre API est démarrée sur http://localhost:8000');
    }
  };

  return (
    <div className="inscription">
      <div className="inscription__form-container">
        <header className="inscription__header">
          <div className="inscription__logo">
            <div className="inscription__logo-text">
              <div className="inscription__logo-icon"></div>
              CheckPoint
            </div>
          </div>
          <h1 className="inscription__title">Créer votre avatar</h1>
          <p className="inscription__subtitle">Et prenez une pause en sauvegardant votre progression...</p>
        </header>

        {currentStep === 1 && (
          <Step1 
            onSubmit={handleStep1Submit}
            initialData={formData}
          />
        )}
      </div>
    </div>
  );
} 