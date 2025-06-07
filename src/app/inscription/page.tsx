"use client";
import React, { useState } from 'react';
import styles from './styles/Inscription.module.scss';
import Step1 from './components/Step1';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOver16: boolean;
  acceptTerms: boolean;
}

export default function Inscription() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isOver16: false,
    acceptTerms: false
  });

  const handleStep1Submit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormData({ ...formData, ...data });
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
    <div className={styles.inscriptionContainer}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoText}>
              <div className={styles.logoIcon}></div>
              CheckPoint
            </div>
          </div>
          <h1 className={styles.title}>Créer votre avatar</h1>
          <p className={styles.subtitle}>Et prenez une pause en sauvegardant votre progression...</p>
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