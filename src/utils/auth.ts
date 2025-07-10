// Utilitaires pour la gestion de l'authentification et de la persistance

export interface User {
  id: string;
  email: string;
  pseudo: string;
  emailVerified: boolean;
}

export interface AuthData {
  token: string;
  user: User;
}

// Vérifier si l'utilisateur est connecté
export const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Utiliser getAuthData qui fait déjà toute la validation
  const authData = getAuthData();
  return authData !== null;
};

// Récupérer les données d'authentification
export const getAuthData = (): AuthData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Vérifier d'abord localStorage
    let token = localStorage.getItem('authToken');
    let user = localStorage.getItem('user');
    
    // Si pas trouvé, vérifier sessionStorage
    if (!token || !user || token === 'undefined' || user === 'undefined') {
      token = sessionStorage.getItem('authToken');
      user = sessionStorage.getItem('user');
    }
    
    // Validation stricte avant parsing
    if (!token || !user || token === 'undefined' || user === 'undefined' || token === 'null' || user === 'null') {
      return null;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      // Vérifier que l'objet parsé a les propriétés requises
      if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.email) {
        console.error('getAuthData: Données utilisateur invalides:', parsedUser);
        return null;
      }
      
      return {
        token,
        user: parsedUser
      };
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      // Nettoyer les données corrompues
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'authentification:', error);
    return null;
  }
};

// Récupérer les données utilisateur
export const getCurrentUser = (): User | null => {
  const authData = getAuthData();
  return authData?.user || null;
};

// Sauvegarder les données d'authentification
export const saveAuthData = (data: AuthData, rememberMe: boolean = false): void => {
    if (!data || !data.token || !data.user) {
        throw new Error('Données d\'authentification invalides');
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    
    try {
        // Sauvegarder le token
        storage.setItem('authToken', data.token);
        
        // S'assurer que emailVerified est un booléen
        const userData = {
            ...data.user,
            emailVerified: Boolean(data.user.emailVerified)
        };
        
        // Sauvegarder les données utilisateur
        storage.setItem('user', JSON.stringify(userData));
        
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
        throw new Error('Impossible de sauvegarder les données d\'authentification');
    }
};

// Vérifier si l'utilisateur a choisi "se souvenir de moi"
export const isRememberMeEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('rememberMe') === 'true';
};

// Déconnexion
export const logout = (): void => {
  // Nettoyer localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('pendingUser');
  localStorage.removeItem('inscriptionStep');
  
  // Nettoyer sessionStorage
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

// Vérifier si l'utilisateur a validé son email (depuis le serveur)
export const isEmailVerifiedFromServer = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return Boolean(userData.emailVerified);
    }
    
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut email depuis le serveur:', error);
    return false;
  }
};

// Vérifier si l'utilisateur a validé son email
export const isEmailVerified = (): boolean => {
    const user = getCurrentUser();
    if (!user) return false;
    
    // Vérifier d'abord dans le stockage local
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            // S'assurer que emailVerified est un booléen
            return Boolean(parsedUser.emailVerified);
        } catch (error) {
            console.error('Erreur lors du parsing des données utilisateur:', error);
        }
    }
    
    // Fallback sur la valeur de l'utilisateur courant
    return Boolean(user.emailVerified);
};

// Déterminer l'étape d'inscription actuelle selon l'état de l'utilisateur
export const getCurrentInscriptionStep = (): string => {
  if (typeof window === 'undefined') return '1';
  
  const user = getCurrentUser();
  const storedStep = localStorage.getItem('inscriptionStep');
  
  if (user && isUserLoggedIn()) {
    if (user.emailVerified) {
      return '4'; // Email vérifié
    } else {
      return '3'; // Connecté mais email non vérifié
    }
  }
  
  return storedStep || '1';
};

// Récupérer le token d'authentification
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Vérifier d'abord localStorage
  let token = localStorage.getItem('authToken');
  
  // Si pas trouvé ou invalide, vérifier sessionStorage
  if (!token || token === 'undefined' || token === 'null') {
    token = sessionStorage.getItem('authToken');
  }
  
  // Validation finale
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }
  
  return token;
};

// Vérifier si le token est valide (pas expiré)
export const isTokenValid = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Si vous utilisez des JWT, vous pouvez décoder et vérifier l'expiration ici
    // Pour l'instant, on considère que si le token existe, il est valide
    return true;
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    return false;
  }
};

// Gestion sécurisée du localStorage avec try/catch
export const safeLocalStorageGet = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Erreur lors de la lecture de localStorage (${key}):`, error);
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'écriture de localStorage (${key}):`, error);
    return false;
  }
};

export const safeLocalStorageRemove = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de localStorage (${key}):`, error);
    return false;
  }
};

// Déterminer l'étape d'inscription initiale
export const getInitialInscriptionStep = async (searchParams?: URLSearchParams): Promise<number> => {
  if (typeof window === 'undefined') return 1;

  try {
    // Vérifier d'abord si l'utilisateur a déjà complété le tutoriel
    const user = getCurrentUser();
    if (user) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.tutorialCompleted) {
          return 0; // 0 signifie que le tutoriel est terminé
        }
      }
    }

    // Si pas de paramètres URL, vérifier le stockage local
    if (!searchParams) {
      const storedStep = localStorage.getItem('inscriptionStep');
      if (storedStep) {
        const step = parseInt(storedStep, 10);
        if (!isNaN(step) && step >= 1 && step <= 7) {
          // Vérification d'email depuis le serveur pour les étapes 5+
          if (step >= 5) {
            const isVerified = await isEmailVerifiedFromServer();
            if (!isVerified) {
              console.warn('Tentative d\'accès à l\'étape', step, 'sans email vérifié. Redirection vers l\'étape 4.');
              return 4; // Rediriger vers l'étape de vérification
            }
          }
          return step;
        }
      }
      return 1;
    }

    // Vérifier les paramètres URL
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 7) {
        // Vérification d'email depuis le serveur pour les étapes 5+
        if (step >= 5) {
          const isVerified = await isEmailVerifiedFromServer();
          if (!isVerified) {
            console.warn('Tentative d\'accès à l\'étape', step, 'sans email vérifié. Redirection vers l\'étape 4.');
            return 4; // Rediriger vers l'étape de vérification
          }
        }
        return step;
      }
    }

    // Vérifier le statut de vérification de l'email
    if (searchParams.get('verified') === 'true') {
      return 4;
    }

    // Vérifier si l'email est déjà vérifié
    if (isEmailVerified()) {
      return 4;
    }

    // Par défaut, commencer à l'étape 1
    return 1;
  } catch (error) {
    console.error('Erreur lors de la détermination de l\'étape d\'inscription:', error);
    return 1;
  }
};

// Fonction pour nettoyer automatiquement les données temporaires
export const cleanupInscriptionData = (): void => {
  safeLocalStorageRemove('inscriptionStep');
  safeLocalStorageRemove('pendingUser');
};

// Mettre à jour le statut de vérification d'email
export const updateEmailVerificationStatus = (verified: boolean): void => {
  const user = getCurrentUser();
  if (!user) return;

  // Mettre à jour dans le stockage approprié
  const isRememberMe = isRememberMeEnabled();
  const storage = isRememberMe ? localStorage : sessionStorage;
  
  try {
    const updatedUser = {
      ...user,
      emailVerified: verified
    };
    
    storage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut email:', error);
  }
}; 