// Utilitaires pour gérer la vérification d'email

export interface PendingUser {
  email: string;
  pseudo: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
}

// Stocker les données utilisateur en attente de vérification
export const storePendingUser = (userData: Omit<PendingUser, 'createdAt'>) => {
  const userWithTimestamp: PendingUser = {
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('pendingUser', JSON.stringify(userWithTimestamp));
  }
};

// Récupérer les données utilisateur en attente
export const getPendingUser = (): PendingUser | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('pendingUser');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Marquer l'email comme vérifié
export const markEmailAsVerified = (email: string) => {
  const pendingUser = getPendingUser();
  if (pendingUser && pendingUser.email === email) {
    const updatedUser: PendingUser = {
      ...pendingUser,
      isVerified: true
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingUser', JSON.stringify(updatedUser));
    }
  }
};

// Supprimer les données utilisateur après vérification réussie
export const clearPendingUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pendingUser');
  }
};

// Vérifier si un utilisateur a un email non vérifié
export const hasUnverifiedEmail = (): boolean => {
  const pendingUser = getPendingUser();
  return pendingUser ? !pendingUser.isVerified : false;
};

// Envoyer un email de vérification
export const sendVerificationEmail = async (email: string, pseudo: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, pseudo }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Email de vérification envoyé avec succès!'
      };
    } else {
      return {
        success: false,
        message: data.error || 'Erreur lors de l\'envoi de l\'email'
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: 'Erreur réseau lors de l\'envoi de l\'email'
    };
  }
}; 