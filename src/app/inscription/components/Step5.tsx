"use client";
import React, { useState, useEffect } from 'react';
import { getCurrentUser, safeLocalStorageSet, User, getAuthToken, debugAuthState, saveAuthData, getAuthData } from '@/utils/auth';
import '../styles/Step5.scss';

// Extension de l'interface User pour inclure profileImage
interface UserWithProfile extends User {
  profileImage?: string;
}

interface Step5Props {
  onNext?: () => void;
}

const Step5 = ({ onNext }: Step5Props) => {
  const [currentUser, setCurrentUser] = useState<UserWithProfile | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('/images/avatars/DefaultAvatar.JPG');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    // DEBUG: Vérifier l'état d'authentification
    console.log('=== DEBUG STEP 5 ===');
    debugAuthState();
    
    // Marquer qu'on est à l'étape 5
    safeLocalStorageSet('inscriptionStep', '5');
    
    // Récupérer l'utilisateur actuel
    const user = getCurrentUser() as UserWithProfile;
    console.log('Utilisateur Step5:', user);
    setCurrentUser(user);
    
    // Définir l'avatar par défaut basé sur l'utilisateur
    if (user && user.profileImage) {
      setSelectedAvatar(user.profileImage);
    }
  }, []);

  const handleSaveAndContinue = async () => {
    try {
      // Sauvegarder l'avatar sélectionné pour l'utilisateur
      if (currentUser) {
        const token = getAuthToken();
        if (!token) {
          alert('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/connexion';
          return;
        }
        
        console.log('Save - Token:', token ? 'Présent' : 'Absent');
        console.log('Save - User ID:', currentUser.id);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            profileImage: selectedAvatar
          }),
        });

        if (response.ok) {
          // Récupérer les données d'authentification actuelles
          const authData = getAuthData();
          if (!authData) {
            console.error('Données d\'authentification non trouvées');
            return;
          }

          // Mettre à jour uniquement l'avatar dans les données utilisateur
          const updatedUser = {
            ...authData.user,
            profileImage: selectedAvatar
          };

          // Sauvegarder les données mises à jour avec le même token
          const isRememberMe = localStorage.getItem('rememberMe') === 'true';
          saveAuthData({ token: authData.token, user: updatedUser }, isRememberMe);
          
          // Continuer vers l'étape suivante
          if (onNext) {
            onNext();
          } else {
            // Si pas de fonction onNext, nettoyer et terminer
            localStorage.removeItem('inscriptionStep');
            localStorage.removeItem('pendingUser');
            window.location.href = '/';
          }
        } else {
          console.error('Erreur lors de la sauvegarde de l\'avatar:', response.status);
          const errorText = await response.text();
          console.error('Erreur details:', errorText);
          alert('Erreur lors de la sauvegarde de l\'avatar. Veuillez réessayer.');
        }
      } else {
        // Si pas d'utilisateur connecté, rediriger vers la connexion
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/connexion';
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('=== UPLOAD DEBUG ===');
    console.log('Fichier sélectionné:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validation du fichier
    if (!validateImageFile(file)) {
      alert('Fichier invalide. Veuillez sélectionner une image JPG, PNG ou WEBP de moins de 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', currentUser?.id || '');

      const token = getAuthToken();
      if (!token) {
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/connexion';
        return;
      }
      
      console.log('Upload - Token:', token ? 'Présent' : 'Absent');
      console.log('Upload - User ID:', currentUser?.id);
      console.log('Upload - API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Upload - FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Upload - Response status:', response.status);
      console.log('Upload - Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Upload - Success result:', result);
        
        // Mettre à jour l'avatar immédiatement pour l'aperçu
        if (result.avatarUrl) {
          setSelectedAvatar(result.avatarUrl);
          
          // Récupérer les données d'authentification actuelles
          const authData = getAuthData();
          if (authData) {
            // Mettre à jour uniquement l'avatar dans les données utilisateur
            const updatedUser = {
              ...authData.user,
              profileImage: result.avatarUrl
            };

            // Sauvegarder les données mises à jour avec le même token
            const isRememberMe = localStorage.getItem('rememberMe') === 'true';
            saveAuthData({ token: authData.token, user: updatedUser }, isRememberMe);
          }
          
          alert('Avatar uploadé avec succès ! Cliquez sur "Sauver et continuer" pour finaliser.');
        } else {
          // Fallback : utiliser une URL temporaire pour l'aperçu
          const fileUrl = URL.createObjectURL(file);
          setSelectedAvatar(fileUrl);
          alert('Avatar uploadé avec succès ! Aperçu affiché. Cliquez sur "Sauver et continuer" pour finaliser.');
        }
      } else {
        console.error('Erreur upload - Status:', response.status);
        let errorMessage = 'Erreur inconnue';
        
        try {
          const error = await response.json();
          console.error('Erreur upload - Details:', error);
          errorMessage = error.error || error.message || `Erreur HTTP ${response.status}`;
          
          // En mode dev, afficher aussi le message de debug
          if (error.debug) {
            errorMessage += '\nDétails: ' + error.debug;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de la réponse:', e);
          const responseText = await response.text();
          console.error('Response text:', responseText);
          errorMessage = `Erreur HTTP ${response.status} - ${response.statusText}`;
        }
        
        alert('Erreur lors de l\'upload: ' + errorMessage);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur de connexion lors de l\'upload.');
    } finally {
      setIsUploading(false);
      // Reset input file
      event.target.value = '';
    }
  };

  const validateImageFile = (file: File): boolean => {
    // Types de fichiers autorisés
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Taille maximale: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return false;
    }

    // Vérifier le nom du fichier pour éviter les attaques
    const fileName = file.name;
    const dangerousPatterns = /<script|javascript:|data:|vbscript:|on\w+\s*=/i;
    if (dangerousPatterns.test(fileName)) {
      return false;
    }

    return true;
  };

  const handleSelectAvatar = () => {
    const fileInput = document.getElementById('avatar-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="step5__form-container">
      <header className="step5__header">
        <div className="step5__quest-label">
          Quête du tutoriel (1 sur 3)
        </div>
        <h1 className="step5__title">
          Personnalisation de l&apos;avatar
        </h1>
        <p className="step5__description">
          Votre personnage &quot;{currentUser?.pseudo || 'NomUtilisateur'}&quot; a été créé, alors pourquoi ne pas personnaliser un 
          peu votre personnage en sélectionnant un avatar correspondant à votre style.
        </p>
      </header>

      <div className="step5__avatar-section">
        <div className="step5__current-avatar" onClick={handleSelectAvatar}>
          <img 
            src={selectedAvatar} 
            alt="Avatar utilisateur"
            className="step5__avatar-image"
            onError={(e) => {
              console.log('Erreur chargement image, fallback vers avatar par défaut');
              e.currentTarget.src = '/images/avatars/DefaultAvatar.JPG';
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="step5__actions">
        <button 
          className="btn-custom-inverse step5__button" 
          onClick={handleSaveAndContinue}
          disabled={isUploading}
        >
          {isUploading ? 'Sauvegarde...' : 'Sauver et continuer'}
        </button>
        <button 
          className="step5__button btn-custom-inverse" 
          onClick={handleSelectAvatar}
          disabled={isUploading}
        >
          {isUploading ? 'Upload en cours...' : 'Sélectionner un avatar'}
        </button>
        <input
          id="avatar-file-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          aria-label="Sélectionner un fichier d'avatar"
        />
      </div>
    </div>
  );
};

export default Step5;