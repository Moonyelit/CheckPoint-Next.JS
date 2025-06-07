"use client";
import React, { useState } from 'react';
import styles from '../styles/Step1.module.scss';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isOver16: boolean;
  acceptTerms: boolean;
}

interface FormErrors {
  username?: string;
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
    if (!formData.username) newErrors.username = 'Le pseudo est requis';
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
    <>
      <form onSubmit={handleSubmit} className={styles.step1Form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="username"
            placeholder="Pseudo"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirmation Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="isOver16"
            checked={formData.isOver16}
            onChange={(e) => setFormData({ ...formData, isOver16: e.target.checked })}
          />
          <label htmlFor="isOver16">J&apos;ai plus de 16 ans</label>
          {errors.isOver16 && <span className={styles.error}>{errors.isOver16}</span>}
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          />
          <label htmlFor="acceptTerms">
            Je suis d&apos;accord avec les conditions d&apos;utilisation, la politique de confidentialité
          </label>
          {errors.acceptTerms && <span className={styles.error}>{errors.acceptTerms}</span>}
        </div>

        <button type="submit" className={styles.submitButton}>
          S&apos;inscrire
        </button>
      </form>


    </>
  );
};

export default Step1; 