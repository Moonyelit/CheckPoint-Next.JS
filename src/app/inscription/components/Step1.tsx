"use client";
import React, { useState } from 'react';
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
}

const Step1 = ({ onSubmit, initialData }: Step1Props) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: FormErrors = {};
    if (!formData.pseudo) newErrors.pseudo = 'Le pseudo est requis';
    if (!formData.email) newErrors.email = 'L&apos;email est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!formData.isOver16) newErrors.isOver16 = 'Vous devez avoir plus de 16 ans';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
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
              onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
            />
          </div>
          {errors.pseudo && <span className="step1__error">{errors.pseudo}</span>}
        </div>

        <div className="step1__form-group">
          <div className="step1__input-container">
            <i className="bx bx-envelope step1__icon"></i>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {errors.email && <span className="step1__error">{errors.email}</span>}
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
            />
          </div>
          {errors.password && <span className="step1__error">{errors.password}</span>}
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
            />
          </div>
          {errors.confirmPassword && <span className="step1__error">{errors.confirmPassword}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="isOver16"
            checked={formData.isOver16}
            onChange={(e) => setFormData({ ...formData, isOver16: e.target.checked })}
          />
          <label htmlFor="isOver16">J&apos;ai plus de 16 ans</label>
          {errors.isOver16 && <span className="step1__error">{errors.isOver16}</span>}
        </div>

        <div className="step1__checkbox-group">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          />
          <label htmlFor="acceptTerms">
            Je suis d&apos;accord avec les conditions d&apos;utilisation, la politique de confidentialité
          </label>
          {errors.acceptTerms && <span className="step1__error">{errors.acceptTerms}</span>}
        </div>


        <div className="step1_endform">
        <button type="submit" className="btn-custom-inverse step1__submit-button">
          S&apos;inscrire
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default Step1; 