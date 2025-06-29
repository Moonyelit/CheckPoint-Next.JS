//head title, description, icon, langue

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../styles/layout.scss";
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import ResourcePreloader from '@/components/common/ResourcePreloader';
import PagePreloader from '@/components/common/PagePreloader';
import ServiceWorkerManager from "@/components/common/ServiceWorkerManager";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "CheckPoint - Découvrez et évaluez vos jeux vidéo",
  description: "Plateforme communautaire pour découvrir, évaluer et partager vos jeux vidéo préférés. Rejoignez CheckPoint et explorez un univers de jeux infini.",
  keywords: "jeux vidéo, évaluation, communauté, gaming, plateforme, découverte",
  authors: [{ name: "CheckPoint Team" }],
  creator: "CheckPoint",
  publisher: "CheckPoint",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CheckPoint - Découvrez et évaluez vos jeux vidéo",
    description: "Plateforme communautaire pour découvrir, évaluer et partager vos jeux vidéo préférés.",
    url: '/',
    siteName: 'CheckPoint',
    images: [
      {
        url: '/images/Logo/Crystal.png',
        width: 1200,
        height: 630,
        alt: 'CheckPoint - Plateforme de jeux vidéo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CheckPoint - Découvrez et évaluez vos jeux vidéo",
    description: "Plateforme communautaire pour découvrir, évaluer et partager vos jeux vidéo préférés.",
    images: ['/images/Logo/Crystal.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

// Ressources critiques à précharger
const criticalResources = [
  { href: "/images/Logo/Crystal.png", as: "image" },
  { href: "/images/default-game-cover.png", as: "image" },
  { href: "/images/Game/Default game.jpg", as: "image" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Préchargement des ressources critiques */}
        <link rel="preload" href="/images/Logo/Crystal.png" as="image" />
        <link rel="dns-prefetch" href="//images.igdb.com" />
        <link rel="preconnect" href="//images.igdb.com" crossOrigin="anonymous" />
        
        {/* Import des polices Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Karantina&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=DM+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        
        {/* Préchargement des polices */}
        <link rel="preload" href="/_next/static/media/geist-sans-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Préchargement des pages populaires */}
        <link rel="prefetch" href="/search" />
        <link rel="prefetch" href="/connexion" />
        <link rel="prefetch" href="/inscription" />
        
        {/* Optimisations de performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${GeistSans.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ResourcePreloader resources={criticalResources} />
        <PagePreloader>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </PagePreloader>
        
        {/* Gestionnaire de Service Worker pour le cache offline */}
        <ServiceWorkerManager />
      </body>
    </html>
  );
}
