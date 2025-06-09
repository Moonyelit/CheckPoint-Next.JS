"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './connexion.scss';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur lors de la saisie
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login_check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Connexion réussie:', userData);
        
        // Sauvegarder les informations d'authentification
        if (userData.token) {
          localStorage.setItem('authToken', userData.token);
        }
        if (userData.user) {
          localStorage.setItem('user', JSON.stringify(userData.user));
        }
        
        // Nettoyer les données d'inscription en attente
        localStorage.removeItem('pendingUser');
        
        // Rediriger vers la page d'accueil ou dashboard
        router.push('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la connexion:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="connexion">
      <div className="connexion__form-container">
        <header className="connexion__header">
          <h1 className="connexion__title">HEY LISTEN</h1>
          <p className="connexion__subtitle">Connectez-vous pour continuer votre aventure...</p>
        </header>

        <form onSubmit={handleSubmit} className="connexion__form">
          {error && (
            <div className="connexion__error-banner">
              {error}
            </div>
          )}

          <div className="connexion__form-group">
            <div className="connexion__input-container">
              <i className="bx bx-envelope connexion__icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="connexion__form-group">
            <div className="connexion__input-container">
              <i className="bx bx-lock-alt connexion__icon"></i>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="connexion__form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-custom-inverse connexion__submit-button"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <div className="connexion__links">
          <button
            type="button"
            onClick={() => router.push('/mot-de-passe-oublie')}
            className="connexion__link"
          >
            Mot de passe oublié ?
          </button>
          
          <div className="connexion__register">
            <span className="connexion__register-text">Pas encore de compte ?</span>
            <button
              type="button"
              onClick={() => router.push('/inscription')}
              className="connexion__register-link"
            >
              S&apos;inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 