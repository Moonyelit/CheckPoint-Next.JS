"use client";
import React, { useState, useEffect } from 'react';
import { getCurrentUser, safeLocalStorageSet, User, getAuthToken, saveAuthData, getAuthData, isEmailVerified } from '@/utils/auth';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  useEffect(() => {
    const initializeStep = async () => {
      try {
        // Vérifier que l'email est vérifié avant d'autoriser l'accès à l'étape 5
        if (!isEmailVerified()) {
          console.warn('Tentative d\'accès à l\'étape 5 sans email vérifié. Redirection vers l\'étape 4.');
          window.location.href = '/inscription?step=4';
          return;
        }

        // Marquer qu'on est à l'étape 5
        safeLocalStorageSet('inscriptionStep', '5');
        
        // Récupérer l'utilisateur actuel
        const user = getCurrentUser() as UserWithProfile;
        
        if (!user) {
          window.location.href = '/connexion';
          return;
        }
        
        setCurrentUser(user);
        
        // Définir l'avatar par défaut basé sur l'utilisateur
        if (user.profileImage) {
          setSelectedAvatar(user.profileImage);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        window.location.href = '/connexion';
      } finally {
        setIsLoading(false);
      }
    };

    initializeStep();
  }, []);

  // Ne rien afficher tant que l'initialisation n'est pas terminée
  if (!isInitialized) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="step5__form-container">
        <div className="step5__loading">
          <div className="step5__loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const handleSaveAndContinue = async () => {
    try {
      if (currentUser) {
        const token = getAuthToken();
        if (!token) {
          alert('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/connexion';
          return;
        }

        // Créer un objet File à partir de l'URL de l'avatar
        const response = await fetch(selectedAvatar);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

        // Créer FormData pour l'upload
        const formData = new FormData();
        formData.append('avatar', file);

        // Utiliser l'endpoint d'upload d'avatar
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error('Erreur lors de la sauvegarde de l\'avatar:', uploadResponse.status);
          console.error('Erreur details:', JSON.stringify(errorData));
          throw new Error(`Erreur lors de la sauvegarde de l'avatar: ${uploadResponse.status}`);
        }

        const result = await uploadResponse.json();
        
        // Mettre à jour les données utilisateur avec la nouvelle URL d'avatar
        const authData = getAuthData();
        if (!authData) {
          console.error('Données d\'authentification non trouvées');
          return;
        }

        // Mettre à jour uniquement l'avatar dans les données utilisateur
        const updatedUser = {
          ...authData.user,
          profileImage: result.avatarUrl
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
        // Si pas d'utilisateur connecté, rediriger vers la connexion
        alert('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/connexion';
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'avatar. Veuillez réessayer.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
      
      // Upload automatique du fichier sélectionné
      await handleUpload(file);
    }
  };

  const handleUpload = async (file?: File) => {
    const fileToUpload = file || selectedFile;
    
    if (!fileToUpload) {
      setUploadError('Veuillez sélectionner un fichier');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const token = getAuthToken();
      const currentUser = getCurrentUser();

      if (!token || !currentUser?.id) {
        setUploadError('Erreur d\'authentification');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', fileToUpload);

      // Utiliser l'endpoint d'upload d'avatar
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        onAvatarUploaded(result.avatarUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.message || 'Erreur lors de l\'upload. Essayez de nouveau ou avec une autre image.');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadError('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectAvatar = () => {
    const fileInput = document.getElementById('avatar-file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const onAvatarUploaded = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    // Récupérer les données d'authentification actuelles
    const authData = getAuthData();
    if (authData) {
      // Mettre à jour uniquement l'avatar dans les données utilisateur
      const updatedUser = {
        ...authData.user,
        profileImage: avatarUrl
      };

      // Sauvegarder les données mises à jour avec le même token
      const isRememberMe = localStorage.getItem('rememberMe') === 'true';
      saveAuthData({ token: authData.token, user: updatedUser }, isRememberMe);
    }
    
    alert('Avatar uploadé avec succès ! Cliquez sur "Sauver et continuer" pour finaliser.');
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

      {/* Messages de succès et d'erreur */}
      {uploadSuccess && (
        <div className="step5__success-message">
          Avatar uploadé avec succès !
        </div>
      )}
      
      {uploadError && (
        <div className="step5__error-message">
          {uploadError}
        </div>
      )}

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
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Sélectionner un fichier d'avatar"
        />
      </div>
    </div>
  );
};

export default Step5;