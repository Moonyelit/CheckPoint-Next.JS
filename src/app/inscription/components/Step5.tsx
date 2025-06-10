"use client";
import React, { useState, useEffect } from 'react';
import { getCurrentUser, safeLocalStorageSet, User } from '@/utils/auth';
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
    // Marquer qu'on est à l'étape 5
    safeLocalStorageSet('inscriptionStep', '5');
    
    // Récupérer l'utilisateur actuel
    const user = getCurrentUser() as UserWithProfile;
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            profileImage: selectedAvatar
          }),
        });

        if (response.ok) {
          // Mettre à jour l'utilisateur local
          const updatedUser = { ...currentUser, profileImage: selectedAvatar };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Nettoyer les données d'inscription maintenant que tout est terminé
          localStorage.removeItem('inscriptionStep');
          localStorage.removeItem('pendingUser');
          
          // Continuer vers l'étape suivante ou terminer
          if (onNext) {
            onNext();
          } else {
            // Rediriger vers l'accueil - inscription terminée !
            window.location.href = '/';
          }
        } else {
          console.error('Erreur lors de la sauvegarde de l\'avatar');
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedAvatar(result.avatarUrl);
        alert('Avatar uploadé avec succès !');
      } else {
        const error = await response.json();
        alert('Erreur lors de l\'upload: ' + (error.message || 'Erreur inconnue'));
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
        <div className="step5__current-avatar">
          <img 
            src={selectedAvatar} 
            alt="Avatar sélectionné"
            className="step5__avatar-image"
            onError={(e) => {
              e.currentTarget.src = '/images/avatars/DefaultAvatar.JPG';
            }}
          />
        </div>
      </div>

      <div className="step5__actions">
        <button 
          className="btn-custom-inverse step5__save-button" 
          onClick={handleSaveAndContinue}
          disabled={isUploading}
        >
          {isUploading ? 'Sauvegarde...' : 'Sauver et continuer'}
        </button>
        <button 
          className="step5__select-button btn-custom-inverse" 
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