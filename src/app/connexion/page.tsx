"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuthData, isRememberMeEnabled } from '@/utils/auth';
import './connexion.scss';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Récupérer la préférence "se souvenir de moi" au chargement
  useEffect(() => {
    const rememberMe = isRememberMeEnabled();
    setFormData(prev => ({ ...prev, rememberMe }));
  }, []);

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
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Connexion réussie:', userData);
        
        // Utiliser la nouvelle fonction saveAuthData
        saveAuthData(userData, formData.rememberMe);
        
        // Nettoyer les données d'inscription en attente
        localStorage.removeItem('pendingUser');
        localStorage.removeItem('inscriptionStep');
        
        // Vérifier le statut de vérification email pour rediriger correctement
        if (userData.user && !userData.user.emailVerified) {
          // Si l'email n'est pas vérifié, rediriger vers l'étape 3
          localStorage.setItem('inscriptionStep', '3');
          router.push('/inscription');
        } else {
          // Email vérifié, rediriger vers l'étape 4 pour afficher le succès
          localStorage.setItem('inscriptionStep', '4');
          router.push('/inscription');
        }
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

          <div className="connexion__checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
            />
            <label htmlFor="rememberMe">Se souvenir de moi</label>
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