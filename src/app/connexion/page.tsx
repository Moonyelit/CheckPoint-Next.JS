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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
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
      <div className="max-w-md mx-auto bg-white bg-opacity-95 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Connexion
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <button
              onClick={() => router.push('/inscription')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              S'inscrire
            </button>
          </p>
          
          <button
            onClick={() => router.push('/mot-de-passe-oublie')}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 block"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </div>
  );
} 