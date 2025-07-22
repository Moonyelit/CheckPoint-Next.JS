"use client";
import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import validator from 'validator';
import LegalModal from '@/components/common/LegalModal';
import { storePendingUser, sendVerificationEmail } from '@/utils/emailVerification';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

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

    // Validation de l'âge
    if (!formData.isOver16) {
      newErrors.isOver16 = 'Vous devez avoir plus de 16 ans pour vous inscrire';
    }

    // Validation des conditions
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Stocker les données utilisateur en attente
      await storePendingUser(formData);
      
      // Envoyer l'email de vérification
      await sendVerificationEmail(formData.email, formData.pseudo);
      
      if (onEmailSent) {
        onEmailSent();
      }
      
      // Soumettre le formulaire
      onSubmit(formData);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="step1" role="region" aria-label="Étape 1 - Création du compte">
      <header className="step1__header">
        <h1 className="step1__title">HEY LISTEN</h1>
        <p className="step1__subtitle">Créez votre compte pour commencer votre aventure...</p>
      </header>

      {error && (
        <div className="step1__error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="step1__form" role="form" aria-label="Formulaire d'inscription">
        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-user step1__icon" aria-hidden="true"></i>
            <label htmlFor="pseudo" className="sr-only">Pseudo</label>
            <input
              type="text"
              id="pseudo"
              placeholder="Pseudo"
              value={formData.pseudo}
              onChange={(e) => handleInputChange('pseudo', e.target.value)}
              autoComplete="username"
              aria-describedby={errors.pseudo ? "pseudo-error" : undefined}
              aria-invalid={!!errors.pseudo}
            />
          </div>
          {errors.pseudo && <span id="pseudo-error" className="step1__error" role="alert" aria-live="polite">{errors.pseudo}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-envelope step1__icon" aria-hidden="true"></i>
            <label htmlFor="email" className="sr-only">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <span id="email-error" className="step1__error" role="alert" aria-live="polite">{errors.email}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-lock-alt step1__icon" aria-hidden="true"></i>
            <label htmlFor="password" className="sr-only">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              autoComplete="new-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="step1__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-pressed={showPassword}
            >
              <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} aria-hidden="true"></i>
            </button>
          </div>
          {errors.password && <span id="password-error" className="step1__error" role="alert" aria-live="polite">{errors.password}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-lock-alt step1__icon" aria-hidden="true"></i>
            <label htmlFor="confirmPassword" className="sr-only">Confirmation du mot de passe</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirmation Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              autoComplete="new-password"
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              aria-invalid={!!errors.confirmPassword}
            />
            <button
              type="button"
              className="step1__password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              aria-pressed={showConfirmPassword}
            >
              <i className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'}`} aria-hidden="true"></i>
            </button>
          </div>
          {errors.confirmPassword && <span id="confirm-password-error" className="step1__error" role="alert" aria-live="polite">{errors.confirmPassword}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="isOver16"
            checked={formData.isOver16}
            onChange={(e) => setFormData({ ...formData, isOver16: e.target.checked })}
            aria-describedby={errors.isOver16 ? "age-error" : undefined}
            aria-invalid={!!errors.isOver16}
          />
          <label htmlFor="isOver16">J&apos;ai plus de 16 ans</label>
          {errors.isOver16 && <span id="age-error" className="step1__error" role="alert" aria-live="polite">{errors.isOver16}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            aria-describedby={errors.acceptTerms ? "terms-error" : undefined}
            aria-invalid={!!errors.acceptTerms}
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
              aria-label="Lire les conditions d'utilisation"
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
              aria-label="Lire la politique de confidentialité"
            >
              politique de confidentialité
            </button>
          </label>
          {errors.acceptTerms && <span id="terms-error" className="step1__error" role="alert" aria-live="polite">{errors.acceptTerms}</span>}
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