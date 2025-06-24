/**
 * Client Redis pour le cache côté serveur
 * 
 * Ce module gère la connexion Redis uniquement côté serveur.
 * Il utilise des imports dynamiques pour éviter les erreurs côté client.
 */

let redisClient: any = null;
let isInitialized = false;

export async function getRedisClient() {
  // Vérifier si on est côté serveur
  if (typeof window !== 'undefined') {
    return null;
  }

  // Si déjà initialisé, retourner le client existant
  if (isInitialized && redisClient) {
    return redisClient;
  }

  try {
    // Import dynamique côté serveur uniquement
    const Redis = (await import('ioredis')).default;
    
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      showFriendlyErrorStack: process.env.NODE_ENV === 'development',
    });

    // Gestion des événements de connexion
    redisClient.on('connect', () => {
      console.log('✅ Connexion Redis établie');
      isInitialized = true;
    });

    redisClient.on('error', (error: Error) => {
      console.error('❌ Erreur Redis:', error.message);
      isInitialized = false;
    });

    redisClient.on('close', () => {
      console.log('🔌 Connexion Redis fermée');
      isInitialized = false;
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Reconnexion Redis...');
    });

    // Tenter la connexion
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.warn('⚠️ Impossible d\'initialiser Redis:', error);
    isInitialized = false;
    return null;
  }
}

export async function closeRedisConnection() {
  if (redisClient && typeof window === 'undefined') {
    try {
      await redisClient.quit();
      redisClient = null;
      isInitialized = false;
      console.log('🔌 Connexion Redis fermée proprement');
    } catch (error) {
      console.error('Erreur lors de la fermeture Redis:', error);
    }
  }
}

// Fermer la connexion à la sortie du processus
if (typeof window === 'undefined') {
  process.on('SIGINT', closeRedisConnection);
  process.on('SIGTERM', closeRedisConnection);
}

/**
 * Teste la connexion Redis
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    const result = await client.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Obtient les statistiques Redis
 */
export async function getRedisStats(): Promise<{
  connected: boolean;
  memory: any;
  info: any;
} | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const [memory, info] = await Promise.all([
      client.memory('USAGE'),
      client.info(),
    ]);

    return {
      connected: true,
      memory,
      info,
    };
  } catch {
    return null;
  }
} 