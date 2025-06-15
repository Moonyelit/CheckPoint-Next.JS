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
      console.log('getAuthData: Aucune donnée d\'authentification trouvée');
      return null;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      // Vérifier que l'objet parsé a les propriétés requises
      if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.email) {
        console.error('getAuthData: Données utilisateur invalides:', parsedUser);
        return null;
      }
      
      console.log('getAuthData: Données d\'authentification récupérées:', {
        token: token ? 'Présent' : 'Absent',
        user: {
          id: parsedUser.id,
          email: parsedUser.email,
          pseudo: parsedUser.pseudo,
          emailVerified: parsedUser.emailVerified
        }
      });
      
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
export const saveAuthData = (userData: AuthData, rememberMe: boolean = false): void => {
  // Validation des données d'entrée
  if (!userData) {
    console.error('saveAuthData: userData est null ou undefined');
    throw new Error('Données utilisateur manquantes');
  }

  if (!userData.token) {
    console.error('saveAuthData: token manquant', userData);
    throw new Error('Token d\'authentification manquant');
  }

  if (!userData.user) {
    console.error('saveAuthData: user manquant', userData);
    throw new Error('Données utilisateur manquantes');
  }

  if (!userData.user.email || !userData.user.id) {
    console.error('saveAuthData: propriétés utilisateur essentielles manquantes', userData.user);
    throw new Error('Email et ID utilisateur requis');
  }

  // Générer un pseudo si manquant
  if (!userData.user.pseudo) {
    userData.user.pseudo = userData.user.email.split('@')[0];
    console.log('Pseudo généré automatiquement:', userData.user.pseudo);
  }

  const storage = rememberMe ? localStorage : sessionStorage;
  
  try {
    // Nettoyer d'abord les anciennes données
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    
    // Sauvegarder les nouvelles données
    storage.setItem('authToken', userData.token);
    storage.setItem('user', JSON.stringify(userData.user));
    
    // Marquer la préférence "se souvenir de moi"
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    console.log('Données d\'authentification sauvegardées avec succès:', {
      storage: rememberMe ? 'localStorage' : 'sessionStorage',
      user: {
        id: userData.user.id,
        email: userData.user.email,
        pseudo: userData.user.pseudo,
        emailVerified: userData.user.emailVerified
      }
    });
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

// Vérifier si l'utilisateur a validé son email
export const isEmailVerified = (): boolean => {
  const user = getCurrentUser();
  return user?.emailVerified || false;
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

// Fonction de debug pour vérifier l'état d'authentification
export const debugAuthState = (): void => {
  if (typeof window === 'undefined') {
    console.log('🔍 Debug Auth: Côté serveur, pas d\'accès au stockage');
    return;
  }

  console.group('🔍 Debug État d\'Authentification');
  
  // localStorage
  const localToken = localStorage.getItem('authToken');
  const localUser = localStorage.getItem('user');
  const rememberMe = localStorage.getItem('rememberMe');
  
  console.log('📁 localStorage:');
  console.log('  - Token:', localToken ? '✅ Présent' : '❌ Absent');
  console.log('  - User:', localUser ? '✅ Présent' : '❌ Absent');
  console.log('  - RememberMe:', rememberMe === 'true' ? '✅ Activé' : '❌ Désactivé');
  
  // sessionStorage
  const sessionToken = sessionStorage.getItem('authToken');
  const sessionUser = sessionStorage.getItem('user');
  
  console.log('📄 sessionStorage:');
  console.log('  - Token:', sessionToken ? '✅ Présent' : '❌ Absent');
  console.log('  - User:', sessionUser ? '✅ Présent' : '❌ Absent');
  
  // États calculés
  console.log('🎯 États calculés:');
  console.log('  - isUserLoggedIn():', isUserLoggedIn() ? '✅ Connecté' : '❌ Déconnecté');
  console.log('  - isEmailVerified():', isEmailVerified() ? '✅ Vérifié' : '❌ Non vérifié');
  console.log('  - isRememberMeEnabled():', isRememberMeEnabled() ? '✅ Activé' : '❌ Désactivé');
  console.log('  - getCurrentInscriptionStep():', getCurrentInscriptionStep());
  
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('👤 Utilisateur actuel:');
    console.log('  - Email:', currentUser.email);
    console.log('  - Pseudo:', currentUser.pseudo);
    console.log('  - ID:', currentUser.id);
  } else {
    console.log('👤 Aucun utilisateur connecté');
  }
  
  console.groupEnd();
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

// Fonction centralisée pour déterminer l'étape d'inscription initiale
export const getInitialInscriptionStep = (searchParams?: URLSearchParams): number => {
  // Vérification côté client uniquement
  if (typeof window === 'undefined') {
    return 1; // Valeur par défaut côté serveur
  }

  try {
    // Priorité 1: Paramètres URL (vérification email directe)
    if (searchParams) {
      const verified = searchParams.get('verified');
      const error = searchParams.get('error');
      
      if (verified === 'true' || error) {
        return 4;
      }
    }
    
    // Priorité 2: Étape stockée dans localStorage (depuis connexion)
    const storedStep = safeLocalStorageGet('inscriptionStep');
    if (storedStep) {
      const parsed = parseInt(storedStep, 10);
      if (parsed >= 1 && parsed <= 6) {
        return parsed;
      }
    }
    
    // Priorité 3: Déduction selon l'état de l'utilisateur connecté
    const currentUser = getCurrentUser();
    if (currentUser && isUserLoggedIn()) {
      if (currentUser.emailVerified) {
        return 4; // Email vérifié
      } else {
        return 3; // Connecté mais email non vérifié
      }
    }
    
    // Valeur par défaut: nouvelle inscription
    return 1;
  } catch (error) {
    console.error('Erreur dans getInitialInscriptionStep:', error);
    return 1; // Fallback sécurisé
  }
};

// Fonction pour nettoyer automatiquement les données temporaires
export const cleanupInscriptionData = (): void => {
  safeLocalStorageRemove('inscriptionStep');
  safeLocalStorageRemove('pendingUser');
};

// Fonction pour mettre à jour le statut de vérification d'email de l'utilisateur connecté
export const updateEmailVerificationStatus = (verified: boolean): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.log('Aucun utilisateur connecté pour mettre à jour');
    return false;
  }
  
  try {
    // Créer un nouvel objet utilisateur avec le statut mis à jour
    const updatedUser: User = {
      ...currentUser,
      emailVerified: verified
    };
    
    // Déterminer quel storage utiliser
    const isRememberMe = isRememberMeEnabled();
    const storage = isRememberMe ? localStorage : sessionStorage;
    
    // Sauvegarder les données mises à jour
    storage.setItem('user', JSON.stringify(updatedUser));
    
    console.log(`Statut emailVerified mis à jour: ${verified} pour ${currentUser.email}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut email:', error);
    return false;
  }
}; 