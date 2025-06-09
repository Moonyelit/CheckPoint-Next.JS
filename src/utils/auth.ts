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
};

// Récupérer les données utilisateur
export const getCurrentUser = (): User | null => {
  const authData = getAuthData();
  return authData?.user || null;
};

// Sauvegarder les données d'authentification
export const saveAuthData = (userData: AuthData, rememberMe: boolean = false): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  
  storage.setItem('authToken', userData.token);
  storage.setItem('user', JSON.stringify(userData.user));
  
  // Marquer la préférence "se souvenir de moi"
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  } else {
    localStorage.removeItem('rememberMe');
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
    if (parsed >= 1 && parsed <= 4) {
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
};

// Fonction pour nettoyer automatiquement les données temporaires
export const cleanupInscriptionData = (): void => {
  safeLocalStorageRemove('inscriptionStep');
  safeLocalStorageRemove('pendingUser');
}; 