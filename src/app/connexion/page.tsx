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
    console.log('🚀 DEBUT DE LA CONNEXION - handleSubmit appelé');
    setIsLoading(true);
    setError('');

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/login_check`;
    const requestData = {
      email: formData.email,
      password: formData.password
    };

    console.log('Tentative de connexion:', {
      url: apiUrl,
      email: formData.email,
      passwordLength: formData.password.length,
      rememberMe: formData.rememberMe
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Réponse de l\'API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Données brutes reçues de l\'API:', userData);
        console.log('Type de userData:', typeof userData);
        console.log('Clés de userData:', Object.keys(userData || {}));
        
        // Vérifier si on a un token ET les données utilisateur
        if (!userData || !userData.token) {
          console.error('Token manquant dans la réponse:', userData);
          setError('Token d\'authentification manquant dans la réponse du serveur');
          return;
        }

        if (!userData.user) {
          console.error('Données utilisateur manquantes dans la réponse:', userData);
          setError('Données utilisateur manquantes dans la réponse du serveur');
          return;
        }

        // ✅ LOGIQUE SIMPLIFIÉE : Plus besoin d'appels API supplémentaires !
        console.log('=== VERIFICATION STATUT EMAIL ===');
        console.log('Email utilisateur:', userData.user.email);
        console.log('emailVerified depuis l\'API:', userData.user.emailVerified);

        // Utiliser directement les données de l'API
        const completeUserData = userData;

        // Utiliser la nouvelle fonction saveAuthData avec gestion d'erreur
        try {
          saveAuthData(completeUserData, formData.rememberMe);
        } catch (authError) {
          console.error('Erreur lors de la sauvegarde des données d\'authentification:', authError);
          setError(authError instanceof Error ? authError.message : 'Erreur lors de la sauvegarde des données');
          return;
        }
        
        // Vérifier le statut de vérification email pour rediriger correctement
        const emailVerified = completeUserData.user.emailVerified;
        console.log('=== DECISION REDIRECTION ===');
        console.log('emailVerified final:', emailVerified, typeof emailVerified);
        
        if (emailVerified === true) {
          // Email vérifié, rediriger vers l'étape 4 pour afficher le succès
          console.log('REDIRECTION vers étape 4 - email vérifié');
          localStorage.setItem('inscriptionStep', '4');
          // Nettoyer les données temporaires
          localStorage.removeItem('pendingUser');
          router.push('/inscription');
        } else {
          // Email non vérifié, rediriger vers l'étape 3
          console.log('REDIRECTION vers étape 3 - email non vérifié');
          localStorage.setItem('inscriptionStep', '3');
          router.push('/inscription');
        }
      } else {
        console.error('Erreur de réponse API:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });

        try {
          const errorData = await response.json();
          console.error('Données d\'erreur de l\'API:', errorData);
          
          // Gestion spécifique des erreurs 401
          if (response.status === 401) {
            setError('Email ou mot de passe incorrect');
          } else {
            setError(errorData.message || `Erreur lors de la connexion (${response.status})`);
          }
        } catch (parseError) {
          console.error('Impossible de parser la réponse d\'erreur:', parseError);
          const errorText = await response.text();
          console.error('Contenu de la réponse d\'erreur:', errorText);
          
          // Gestion spécifique des erreurs 401 même si pas de JSON
          if (response.status === 401) {
            setError('Email ou mot de passe incorrect');
          } else {
            setError(`Erreur lors de la connexion (${response.status}): ${response.statusText}`);
          }
        }
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