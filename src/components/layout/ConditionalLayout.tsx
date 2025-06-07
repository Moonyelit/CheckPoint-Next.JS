"use client";

import { usePathname } from 'next/navigation';
import NoLoginNavbar from '@/components/common/NoLoginNavbar';
import Footer from '@/components/common/Footer';

/**
 * 🔄 LAYOUT CONDITIONNEL - AIGUILLEUR INTELLIGENT DE LAYOUTS
 * ==========================================================
 * 
 * PROBLÈME RÉSOLU : Certaines pages (inscription) ont besoin d'un layout spécial
 * sans navbar standard ni footer pour une immersion totale
 * 
 * FONCTIONNEMENT :
 * - Détecte la page courante avec usePathname()
 * - Si page normale : Affiche NoLoginNavbar + contenu + Footer
 * - Si page exclue : Affiche seulement le contenu
 * 
 * AVANTAGE : Évite de dupliquer la logique dans chaque page
 */
interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname(); // 📍 Détecte la page courante
  
  // 📋 LISTE DES PAGES AVEC LAYOUT SPÉCIAL (sans navbar/footer standard)
  const excludedPages = ['/inscription']; // Page d'inscription = layout immersif
  const shouldShowDefaultLayout = !excludedPages.includes(pathname);

  // 🏠 LAYOUT STANDARD : Navbar + Contenu + Footer
  if (shouldShowDefaultLayout) {
    return (
      <>
        <NoLoginNavbar />  {/* 🧭 Navbar de navigation standard */}
        <main className="flex-grow">
          {children}       {/* 📄 Contenu de la page */}
        </main>
        <Footer />         {/* 🦶 Footer avec liens et infos */}
      </>
    );
  }

  // 🎭 LAYOUT SPÉCIAL : Contenu seulement (pages immersives)
  return <>{children}</>; // ✨ Affichage pur sans navbar/footer
} 