//head title, description, icon, langue

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/layout.scss";
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import ResourcePreloader from '@/components/common/ResourcePreloader';
import PagePreloader from '@/components/common/PagePreloader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Checkout",
  icons: {
    icon: "/images/Logo/Crystal.png", 
  },
  description: "La plateforme gamifiée pour suivre ta progression et gérer ta collection de jeux vidéo",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
  other: {
    "theme-color": "#000000",
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
        
        {/* Préchargement des polices */}
        <link rel="preload" href="/_next/static/media/geist-sans-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/media/geist-mono-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Préchargement des pages populaires */}
        <link rel="prefetch" href="/search" />
        <link rel="prefetch" href="/connexion" />
        <link rel="prefetch" href="/inscription" />
        
        {/* Optimisations de performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ResourcePreloader resources={criticalResources} />
        <PagePreloader>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </PagePreloader>
      </body>
    </html>
  );
}
