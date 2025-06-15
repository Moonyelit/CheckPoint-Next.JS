"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveAuthData, isRememberMeEnabled } from '@/utils/auth';
import { useHydrationFix } from '@/hooks/useHydrationFix';
import './connexion.scss';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Connexion() {
  useHydrationFix(); // Résout les erreurs d'hydratation causées par les extensions
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Vérifier si l'email a été vérifié
  useEffect(() => {
    if (searchParams?.get('verified') === 'true') {
      setSuccessMessage('Votre compte a été validé avec succès ! Vous pouvez maintenant vous connecter pour continuer votre aventure.');
    }
  }, [searchParams]);

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
    setError('');
    setIsLoading(true);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la connexion');
        }

        if (!data.token) {
            throw new Error('Token d\'authentification manquant dans la réponse du serveur');
        }

        if (!data.user) {
            throw new Error('Données utilisateur manquantes dans la réponse du serveur');
        }

        // Sauvegarder les données d'authentification
        saveAuthData(data, formData.rememberMe);

        // Rediriger en fonction du statut de vérification de l'email
        if (data.user.emailVerified) {
            router.push('/');
        } else {
            router.push('/inscription?step=4');
        }

    } catch (error) {
        console.error('Erreur de connexion:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
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
            <div 
              className="connexion__error-banner" 
              role="alert" 
              aria-live="assertive"
              aria-label="Erreur de connexion"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div 
              className="connexion__success-banner" 
              role="alert" 
              aria-live="polite"
              aria-label="Message de succès"
            >
              {successMessage}
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