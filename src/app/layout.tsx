//head title, description, icon, langue

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/layout.scss";
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import Preloader from '@/components/common/Preloader';
import ResourcePreloader from '@/components/common/ResourcePreloader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Checkout",
  icons: {
    icon: "/images/Logo/Crystal.png", 
  },
  description: "La plateforme gamifiée pour suivre ta progression et gérer ta collection de jeux vidéo",
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
        <link rel="preconnect" href="//images.igdb.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ResourcePreloader resources={criticalResources} />
        <Preloader>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Preloader>
      </body>
    </html>
  );
}
