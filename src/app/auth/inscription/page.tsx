"use client";
import React, { useState } from 'react';
import styles from './styles/Inscription.module.scss';
import Step1 from './components/Step1';
// import Step2 from './components/Step2';
// import Step3 from './components/Step3';
// import Step4 from './components/Step4';
// import Step5 from './components/Step5';
// import Step6 from './components/Step6';
// import Step7 from './components/Step7';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOver16: boolean;
  acceptTerms: boolean;
  // Ajoutez ici les autres champs nécessaires pour les étapes suivantes
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

  // const handleStepComplete = (stepNumber: number) => {
  //   setCurrentStep(stepNumber + 1);
  // };

  return (
    <div className={styles.inscriptionContainer}>
      {currentStep === 1 && (
        <Step1 
          onSubmit={handleStep1Submit}
          initialData={formData}
        />
      )}
      {/* {currentStep === 2 && (
        <Step2 
          onComplete={() => handleStepComplete(2)}
          username={formData.username}
        />
      )}
      {currentStep === 3 && (
        <Step3 
          onComplete={() => handleStepComplete(3)}
          username={formData.username}
        />
      )}
      {currentStep === 4 && (
        <Step4 
          onComplete={() => handleStepComplete(4)}
          username={formData.username}
        />
      )}
      {currentStep === 5 && (
        <Step5 
          onComplete={() => handleStepComplete(5)}
          username={formData.username}
        />
      )}
      {currentStep === 6 && (
        <Step6 
          onComplete={() => handleStepComplete(6)}
          username={formData.username}
        />
      )}
      {currentStep === 7 && (
        <Step7 
          username={formData.username}
        />
      )} */}
    </div>
  );
}
