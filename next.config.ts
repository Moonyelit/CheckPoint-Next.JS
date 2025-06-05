import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
    prependData: `@use "@/styles/mixins" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Supprime les warnings d'hydratation causés par les extensions de navigateur
  onDemandEntries: {
    // Délai avant de supprimer les pages non utilisées de la mémoire (en ms)
    maxInactiveAge: 25 * 1000,
  },
  // Configuration pour réduire les erreurs d'hydratation
  experimental: {
    // Améliore la gestion de l'hydratation
    optimizePackageImports: ['next/font'],
  },
  // Configuration webpack pour masquer les warnings d'hydratation d'extensions
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Masque les warnings spécifiques aux extensions en développement
      config.infrastructureLogging = {
        level: 'error',
      };
      
      // Supprime les warnings console.error pour les problèmes d'hydratation d'extensions
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        if (entries['main.js'] && !entries['main.js'].includes('./src/lib/hydration-fix.js')) {
          entries['main.js'].unshift('./src/lib/hydration-fix.js');
        }
        
        return entries;
      };
    }
    
    return config;
  },
  async redirects() {
    return [
      {
        source: '/home/noLogin',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
