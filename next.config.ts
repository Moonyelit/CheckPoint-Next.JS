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
    // Optimisation des images
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimisations de performance
  experimental: {
    // Améliore la gestion de l'hydratation
    optimizePackageImports: ['next/font', 'axios', 'react-hook-form'],
    // Préchargement des pages
    optimizeCss: true,
    // Améliore le streaming SSR
    serverComponentsExternalPackages: ['@react-three/fiber', '@react-three/drei', 'ioredis'],
  },
  // Configuration pour réduire les erreurs d'hydratation
  onDemandEntries: {
    // Délai avant de supprimer les pages non utilisées de la mémoire (en ms)
    maxInactiveAge: 25 * 1000,
    // Nombre maximum de pages à garder en mémoire
    pagesBufferLength: 5,
  },
  // Optimisations de compilation
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
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

    // Configuration SVG pour éviter les erreurs SVGO
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false, // Désactiver SVGO complètement
          },
        },
      ],
    });

    // Optimisations pour la production
    if (!dev) {
      // Optimisation des chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }
    
    // Configuration webpack pour exclure ioredis du bundle client
    if (!isServer) {
      // Exclure ioredis du bundle côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        events: false,
        querystring: false,
      };
    }
    
    return config;
  },
  // Headers pour améliorer le caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
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
