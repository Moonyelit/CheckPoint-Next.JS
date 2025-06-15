"use client";
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import validator from 'validator';
import LegalModal from '@/components/common/LegalModal';
import { storePendingUser, sendVerificationEmail } from '@/utils/emailVerification';
import { safeLocalStorageSet } from '@/utils/auth';
import '../styles/Step1.scss';

interface FormData {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOver16: boolean;
  acceptTerms: boolean;
}

interface FormErrors {
  pseudo?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  isOver16?: string;
  acceptTerms?: string;
}

interface Step1Props {
  onSubmit: (data: FormData) => void;
  initialData: FormData;
  onEmailSent?: () => void;
}

const Step1 = ({ onSubmit, initialData, onEmailSent }: Step1Props) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy'>('terms');

  // Fonction de sanitisation
  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  // Fonction de validation du pseudo
  const validatePseudo = (pseudo: string): string | null => {
    if (!pseudo) return 'Le pseudo est requis';
    if (pseudo.length < 3) return 'Le pseudo doit contenir au moins 3 caractères';
    if (pseudo.length > 15) return 'Le pseudo ne peut pas dépasser 15 caractères';
    if (!/^[a-zA-Z0-9_-]+$/.test(pseudo)) return 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores';
    return null;
  };

  // Fonction de validation du mot de passe
  const validatePassword = (password: string): string | null => {
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/(?=.*[a-z])/.test(password)) return 'Le mot de passe doit contenir au moins une minuscule';
    if (!/(?=.*[A-Z])/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!/(?=.*\d)/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData({ ...formData, [field]: sanitizedValue });
    
    // Effacer l'erreur du champ lors de la saisie
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation avec sécurité
    const newErrors: FormErrors = {};
    
    // Validation du pseudo
    const pseudoError = validatePseudo(formData.pseudo);
    if (pseudoError) newErrors.pseudo = pseudoError;

    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validator.isEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation du mot de passe
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation des checkboxes
    if (!formData.isOver16) newErrors.isOver16 = 'Vous devez avoir plus de 16 ans';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';

    if (Object.keys(newErrors).length === 0) {
      // Sanitiser toutes les données avant l'envoi
      const sanitizedData = {
        ...formData,
        pseudo: sanitizeInput(formData.pseudo),
        email: sanitizeInput(formData.email.toLowerCase()),
        password: formData.password, // Ne pas sanitiser le mot de passe
        confirmPassword: formData.confirmPassword
      };

      // Stocker les données utilisateur pour la vérification avec indicateur d'étape
      storePendingUser({
        email: sanitizedData.email,
        pseudo: sanitizedData.pseudo,
        isVerified: false
      });
      
      // Marquer qu'on passe à l'étape 2
      safeLocalStorageSet('inscriptionStep', '2');

      // Envoyer l'email de vérification avec le pseudo
      const verificationResult = await sendVerificationEmail(sanitizedData.email, sanitizedData.pseudo);
      if (verificationResult.success) {
        console.log('Email de vérification envoyé avec succès');
        onEmailSent?.();
      } else {
        console.error('Erreur lors de l\'envoi de l\'email:', verificationResult.message);
      }

      onSubmit(sanitizedData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="step1__form-container">
      <header className="step1__header">
        <h1 className="step1__title">Créer votre avatar</h1>
        <p className="step1__subtitle">Et prenez une pause en sauvegardant votre progression...</p>
      </header>
    
      <form onSubmit={handleSubmit} className="step1__form">
        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-user step1__icon"></i>
            <input
              type="text"
              id="pseudo"
              placeholder="Pseudo"
              value={formData.pseudo}
              onChange={(e) => handleInputChange('pseudo', e.target.value)}
              maxLength={15}
              autoComplete="username"
            />
          </div>
          {errors.pseudo && <span className="step1__error" role="alert" aria-live="polite">{errors.pseudo}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-envelope step1__icon"></i>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              autoComplete="email"
            />
          </div>
          {errors.email && <span className="step1__error" role="alert" aria-live="polite">{errors.email}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-lock-alt step1__icon"></i>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          {errors.password && <span className="step1__error" role="alert" aria-live="polite">{errors.password}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-lock-alt step1__icon"></i>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmation Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && <span className="step1__error" role="alert" aria-live="polite">{errors.confirmPassword}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="isOver16"
            checked={formData.isOver16}
            onChange={(e) => setFormData({ ...formData, isOver16: e.target.checked })}
          />
          <label htmlFor="isOver16">J&apos;ai plus de 16 ans</label>
          {errors.isOver16 && <span className="step1__error" role="alert" aria-live="polite">{errors.isOver16}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          />
          <label htmlFor="acceptTerms">
            Je suis d&apos;accord avec les{' '}
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="step1__legal-link"
            >
              conditions d&apos;utilisation
            </button>
            {' '}et la{' '}
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="step1__legal-link"
            >
              politique de confidentialité
            </button>
          </label>
          {errors.acceptTerms && <span className="step1__error" role="alert" aria-live="polite">{errors.acceptTerms}</span>}
        </div>

        <div className="step1_endform">
        <button type="submit" className="btn-custom-inverse step1__submit-button">
          S&apos;inscrire
        </button>
        </div>
        
      </form>

      <LegalModal 
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
};

export default Step1;